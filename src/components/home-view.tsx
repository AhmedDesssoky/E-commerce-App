import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CategorySlider } from "@/components/category-slider";
import { HomeHero } from "@/components/home-hero";
import { HomeSectionHeader } from "@/components/home-section-header";
import { ProductCardGrid } from "@/components/product-card";
import {
  BrandStripSkeleton,
  CatalogStatus,
  CategorySliderSkeleton,
  ProductGridSkeleton,
} from "@/components/skeleton";
import {
  listBrands,
  listCategories,
  listProducts,
  loadCatalogSlice,
} from "@/lib/api/catalog";

function CatalogNote({ children }: { children: string }) {
  return (
    <p className="max-w-[var(--token-measure-body)] text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
      {children}
    </p>
  );
}

async function CategoryRail() {
  const t = await getTranslations("common");
  const categories = await loadCatalogSlice("categories", () =>
    listCategories({ limit: 8 }),
  );

  if (categories === null) {
    return <CatalogNote>{t("home.unavailable")}</CatalogNote>;
  }

  if (categories.length === 0) {
    return <CatalogNote>{t("home.emptyCategories")}</CatalogNote>;
  }

  return <CategorySlider categories={categories} />;
}

async function BrandStrip() {
  const t = await getTranslations("common");
  const brands = await loadCatalogSlice("brands", () =>
    listBrands({ limit: 12 }),
  );

  if (brands === null) {
    return <CatalogNote>{t("home.unavailable")}</CatalogNote>;
  }

  if (brands.length === 0) {
    return <CatalogNote>{t("home.emptyBrands")}</CatalogNote>;
  }

  return (
    <ul className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
      {brands.map((brand) => (
        <li key={brand._id} className="flex min-h-12 min-w-24 flex-1 items-center justify-center">
          <Link
            href={{ pathname: "/brands/[id]", params: { id: brand._id } }}
            className="flex min-h-12 items-center justify-center"
          >
            <Image
              src={brand.image}
              alt={brand.name}
              width={140}
              height={56}
              className="max-h-10 w-auto object-contain"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function ProductShelf() {
  const t = await getTranslations("common");
  const products = await loadCatalogSlice("products", () =>
    listProducts({ limit: 9, sort: "-sold" }),
  );

  if (products === null) {
    return <CatalogNote>{t("home.unavailable")}</CatalogNote>;
  }

  if (products.length === 0) {
    return <CatalogNote>{t("home.emptyProducts")}</CatalogNote>;
  }

  return <ProductCardGrid products={products} />;
}

export async function HomeView() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <HomeHero />

      <section className="mx-auto w-full min-w-0 max-w-[var(--token-measure-content)] px-[var(--token-gutter)] pt-20 pb-4">
        <HomeSectionHeader
          title={t("nav.categories")}
          href="/categories"
          viewAll={t("home.viewAll")}
        />
        <Suspense
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <CategorySliderSkeleton />
            </CatalogStatus>
          }
        >
          <CategoryRail />
        </Suspense>
      </section>

      <section className="mt-16 border-y border-line bg-bone">
        <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-20">
          <HomeSectionHeader
            title={t("nav.products")}
            href="/products"
            viewAll={t("home.viewAll")}
          />
          <Suspense
            fallback={
              <CatalogStatus label={t("home.loading")}>
                <ProductGridSkeleton count={8} />
              </CatalogStatus>
            }
          >
            <ProductShelf />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-16">
        <HomeSectionHeader
          title={t("nav.brands")}
          href="/brands"
          viewAll={t("home.viewAll")}
        />
        <Suspense
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <BrandStripSkeleton />
            </CatalogStatus>
          }
        >
          <BrandStrip />
        </Suspense>
      </section>
    </div>
  );
}
