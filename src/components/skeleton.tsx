import type { ReactNode } from "react";

export function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

export function CatalogStatus({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-label={label}>
      {children}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[var(--token-ratio-product)] rounded-md" />
      <Skeleton className="mt-3 h-3 w-1/3 rounded-sm" />
      <Skeleton className="mt-2 h-4 w-2/3 rounded-sm" />
      <Skeleton className="mt-2 h-4 w-1/4 rounded-sm" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function CategorySliderSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden md:gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="w-[70%] shrink-0 sm:w-[45%] md:w-[31%] lg:w-[23%]"
        >
          <Skeleton className="aspect-[3/4] rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function BrandStripSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-10 min-w-24 flex-1 rounded-sm" />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[var(--token-measure-content)] flex-col px-[var(--token-gutter)] py-12">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <Skeleton className="aspect-[var(--token-ratio-product)] rounded-md" />
        <div className="flex max-w-[var(--token-measure-body)] flex-col gap-5">
          <Skeleton className="h-3 w-24 rounded-sm" />
          <Skeleton className="h-8 w-3/4 rounded-sm" />
          <Skeleton className="h-6 w-28 rounded-sm" />
          <Skeleton className="h-24 w-full rounded-sm" />
          <Skeleton className="h-12 w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
