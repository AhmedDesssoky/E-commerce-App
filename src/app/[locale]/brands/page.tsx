import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogStatus } from "@/components/skeleton";
import { listBrands, loadCatalogSlice } from "@/lib/api/catalog";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("brands") };
}

async function BrandGrid() {
  const t = await getTranslations("common");
  const brands = await loadCatalogSlice("brands", () =>
    listBrands({ limit: 40 }),
  );

  if (brands === null) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("catalog.unavailable")}
      </p>
    );
  }

  if (brands.length === 0) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("catalog.emptyBrands")}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {brands.map((brand) => (
        <li key={brand._id}>
          <Link
            href={{ pathname: "/brands/[id]", params: { id: brand._id } }}
            className="flex flex-col items-center justify-center gap-3 rounded-md border border-line bg-paper p-6 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:border-ink"
          >
            <div className="relative flex h-16 w-full items-center justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                width={140}
                height={64}
                className="max-h-14 w-auto object-contain"
              />
            </div>
            <span className="text-center text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
              {brand.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function BrandGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i}>
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-line bg-paper p-6">
            <div className="skeleton h-14 w-24 rounded-sm" aria-hidden />
            <div className="skeleton h-3 w-16 rounded-sm" aria-hidden />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function BrandsPage() {
  const t = await getTranslations("common");

  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("nav.brands")}
      </h1>

      <div className="mt-10">
        <Suspense
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <BrandGridSkeleton />
            </CatalogStatus>
          }
        >
          <BrandGrid />
        </Suspense>
      </div>
    </div>
  );
}
