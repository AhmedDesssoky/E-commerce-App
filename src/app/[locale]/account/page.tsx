import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";
import { UpdateProfileForm } from "@/components/update-profile-form";
import { RouteApiError } from "@/lib/api/route-error";
import { getLoggedUser } from "@/lib/api/users";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("account") };
}

export default async function AccountPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({
      href: { pathname: "/sign-in", query: { next: "/account" } },
      locale,
    });
    return null;
  }

  let user;

  try {
    user = await getLoggedUser(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({
        href: { pathname: "/sign-in", query: { next: "/account" } },
        locale,
      });
      return null;
    }

    return (
      <AccountShell title={t("nav.account")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("account.unavailable")}
        </p>
      </AccountShell>
    );
  }

  return (
    <AccountShell title={t("nav.account")}>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-paper p-5 shadow-sm">
          <h2 className="mb-4 text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
            {t("account.profile")}
          </h2>
          <UpdateProfileForm user={user} />
        </section>

        <section className="rounded-lg border border-line bg-paper p-5 shadow-sm">
          <h2 className="mb-4 text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
            {t("account.passwordHeading")}
          </h2>
          <ChangePasswordForm />
        </section>
      </div>
    </AccountShell>
  );
}

function AccountShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {title}
      </h1>
      <div className="mt-10">{children}</div>
    </div>
  );
}
