import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogStatus } from "@/components/skeleton";
import { listCategories, loadCatalogSlice } from "@/lib/api/catalog";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("categories") };
}

async function CategoryGrid() {
  const t = await getTranslations("common");
  const categories = await loadCatalogSlice("categories", () =>
    listCategories({ limit: 40 }),
  );

  if (categories === null) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("catalog.unavailable")}
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("catalog.emptyCategories")}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((category) => (
        <li key={category._id}>
          <Link
            href={{ pathname: "/categories/[id]", params: { id: category._id } }}
            className="group flex flex-col items-center gap-3 rounded-md border border-line bg-paper p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:border-ink"
          >
            <div className="relative size-20 overflow-hidden rounded-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <span className="text-center text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
              {category.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CategoryGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i}>
          <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-paper p-4">
            <div className="skeleton size-20 rounded-full" aria-hidden />
            <div className="skeleton h-3 w-16 rounded-sm" aria-hidden />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function CategoriesPage() {
  const t = await getTranslations("common");

  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("nav.categories")}
      </h1>

      <div className="mt-10">
        <Suspense
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <CategoryGridSkeleton />
            </CatalogStatus>
          }
        >
          <CategoryGrid />
        </Suspense>
      </div>
    </div>
  );
}
