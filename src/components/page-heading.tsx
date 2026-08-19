import { getTranslations } from "next-intl/server";

type PageHeadingKey = "products" | "categories" | "brands" | "cart";

export async function PageHeading({ navKey }: { navKey: PageHeadingKey }) {
  const t = await getTranslations("common.nav");

  return (
    <div className="px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t(navKey)}
      </h1>
    </div>
  );
}
