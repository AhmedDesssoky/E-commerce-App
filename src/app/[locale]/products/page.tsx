import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronEndIcon, ChevronStartIcon } from "@/components/nav-icons";
import { ProductCardGrid } from "@/components/product-card";
import { CatalogStatus, ProductGridSkeleton } from "@/components/skeleton";
import { listProductsPaginated, loadCatalogSlice } from "@/lib/api/catalog";

const PRODUCTS_PER_PAGE = 20;

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("products") };
}

function parsePageParam(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.floor(num);
}

async function ProductGrid({ page }: { page: number }) {
  const t = await getTranslations("common");
  const result = await loadCatalogSlice("products", () =>
    listProductsPaginated({ limit: PRODUCTS_PER_PAGE, page }),
  );

  if (result === null) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("products.unavailable")}
      </p>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("products.empty")}
      </p>
    );
  }

  const { currentPage, numberOfPages } = result.metadata;

  return (
    <div className="flex flex-col gap-12">
      <ProductCardGrid products={result.items} />

      {numberOfPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={numberOfPages}
        />
      )}
    </div>
  );
}

async function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const t = await getTranslations("common.products");
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label={t("page", { current: currentPage, total: totalPages })}
      className="flex items-center justify-center gap-4"
    >
      {hasPrev ? (
        <Link
          href={{ pathname: "/products", query: { page: currentPage - 1 } }}
          className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
          aria-label={t("previous")}
        >
          <ChevronStartIcon />
          {t("previous")}
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-line" aria-hidden>
          <ChevronStartIcon />
          {t("previous")}
        </span>
      )}

      <span className="text-[length:var(--token-label-size)] font-medium tabular-nums text-ink">
        {t("page", { current: currentPage, total: totalPages })}
      </span>

      {hasNext ? (
        <Link
          href={{ pathname: "/products", query: { page: currentPage + 1 } }}
          className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
          aria-label={t("next")}
        >
          {t("next")}
          <ChevronEndIcon />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-line" aria-hidden>
          {t("next")}
          <ChevronEndIcon />
        </span>
      )}
    </nav>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const t = await getTranslations("common");
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);

  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("nav.products")}
      </h1>

      <div className="mt-10">
        <Suspense
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
            </CatalogStatus>
          }
        >
          <ProductGrid page={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
