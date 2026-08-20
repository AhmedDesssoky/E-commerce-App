import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { WishlistItem } from "@/components/wishlist-item";
import { getWishlist } from "@/lib/api/wishlist";
import { RouteApiError } from "@/lib/api/route-error";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("wishlist") };
}

export default async function WishlistPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({ href: "/sign-in", locale });
    return null;
  }

  let items;

  try {
    items = await getWishlist(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({ href: "/sign-in", locale });
    }

    return (
      <WishlistShell title={t("nav.wishlist")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("wishlist.unavailable")}
        </p>
      </WishlistShell>
    );
  }

  if (items.length === 0) {
    return (
      <WishlistShell title={t("nav.wishlist")}>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
            {t("wishlist.empty")}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
          >
            {t("wishlist.emptyAction")}
          </Link>
        </div>
      </WishlistShell>
    );
  }

  return (
    <WishlistShell title={t("nav.wishlist")}>
      <div className="rounded-lg border border-line bg-paper p-2 shadow-sm">
        <div className="divide-y divide-line">
        {items.map((item) => (
          <WishlistItem key={item._id} item={item} />
        ))}
        </div>
      </div>
    </WishlistShell>
  );
}

function WishlistShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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
