import { redirect } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/sign-in-form";
import { parseNextParam } from "@/lib/auth/return-path";
import { getRouteToken } from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");

  return { title: t("signIn") };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const token = await getRouteToken();
  if (token) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  const t = await getTranslations("common.nav");
  const query = await searchParams;
  const next = parseNextParam(query.next);

  return (
    <div className="mx-auto flex w-full max-w-[var(--token-measure-checkout)] flex-col gap-8 px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("signIn")}
      </h1>
      <SignInForm next={next} />
    </div>
  );
}
