import Image from "next/image";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link, notFound } from "@/i18n/navigation";
import { ChevronEndIcon, ChevronStartIcon } from "@/components/nav-icons";
import { ProductCardGrid } from "@/components/product-card";
import { CatalogStatus, ProductGridSkeleton } from "@/components/skeleton";
import {
  categoryIdSchema,
  getCategory,
  listProductsPaginated,
  loadCatalogSlice,
} from "@/lib/api/catalog";

const PRODUCTS_PER_PAGE = 20;

function parsePageParam(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.floor(num);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!categoryIdSchema.safeParse(id).success) {
    return {};
  }

  const category = await loadCatalogSlice("category-meta", () => getCategory(id));

  if (!category) {
    return {};
  }

  return {
    title: category.name,
  };
}

async function CategoryProductGrid({
  categoryId,
  page,
}: {
  categoryId: string;
  page: number;
}) {
  const t = await getTranslations("common");

  const result = await loadCatalogSlice("category-products", () =>
    listProductsPaginated({ category: categoryId, limit: PRODUCTS_PER_PAGE, page }),
  );

  if (result === null) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("categories.unavailable")}
      </p>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("categories.emptyProducts")}
      </p>
    );
  }

  const { currentPage, numberOfPages } = result.metadata;

  return (
    <div className="flex flex-col gap-12">
      <ProductCardGrid products={result.items} />

      {numberOfPages > 1 ? (
        <CategoryPagination
          categoryId={categoryId}
          currentPage={currentPage}
          totalPages={numberOfPages}
        />
      ) : null}
    </div>
  );
}

async function CategoryPagination({
  categoryId,
  currentPage,
  totalPages,
}: {
  categoryId: string;
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
          href={{
            pathname: "/categories/[id]",
            params: { id: categoryId },
            query: { page: currentPage - 1 },
          }}
          className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
          aria-label={t("previous")}
        >
          <ChevronStartIcon />
          {t("previous")}
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-line"
          aria-hidden
        >
          <ChevronStartIcon />
          {t("previous")}
        </span>
      )}

      <span className="text-[length:var(--token-label-size)] font-medium tabular-nums text-ink">
        {t("page", { current: currentPage, total: totalPages })}
      </span>

      {hasNext ? (
        <Link
          href={{
            pathname: "/categories/[id]",
            params: { id: categoryId },
            query: { page: currentPage + 1 },
          }}
          className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
          aria-label={t("next")}
        >
          {t("next")}
          <ChevronEndIcon />
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-2 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-line"
          aria-hidden
        >
          {t("next")}
          <ChevronEndIcon />
        </span>
      )}
    </nav>
  );
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ id }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const currentPage = parsePageParam(pageParam);

  if (!categoryIdSchema.safeParse(id).success) {
    notFound();
  }

  const category = await loadCatalogSlice("category", () => getCategory(id));

  if (!category) {
    notFound();
  }

  const t = await getTranslations("common");

  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-start">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-line">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
            {category.name}
          </h1>
          <p className="mt-1 text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
            {t("categories.productsHeading")}
          </p>
        </div>
      </header>

      <div className="mt-10">
        <Suspense
          key={`${id}-${currentPage}`}
          fallback={
            <CatalogStatus label={t("home.loading")}>
              <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
            </CatalogStatus>
          }
        >
          <CategoryProductGrid categoryId={id} page={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
