"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { WishlistProduct } from "@/lib/api/wishlist";
import { RemoveFromWishlistButton } from "@/components/wishlist-button";

export function WishlistItem({ item }: { item: WishlistProduct }) {
  const locale = useLocale();

  return (
    <div className="flex gap-4 rounded-md p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-bone">
      <Link
        href={{ pathname: "/products/[id]", params: { id: item._id } }}
        className="shrink-0"
      >
        <div className="relative size-24 overflow-hidden rounded-md border border-line bg-paper sm:size-28">
          <Image
            src={item.imageCover}
            alt={item.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={{ pathname: "/products/[id]", params: { id: item._id } }}
              className="line-clamp-2 text-[length:var(--token-title-size)] font-medium leading-[var(--token-title-line)] text-ink hover:underline"
            >
              {item.title}
            </Link>
            {item.brand ? (
              <p className="mt-0.5 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
                {item.brand.name}
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-[length:var(--token-price-size)] font-semibold tabular-nums text-ink">
            {item.price.toLocaleString(locale, { style: "currency", currency: "EGP" })}
          </p>
        </div>

        <div className="flex items-center justify-end">
          <RemoveFromWishlistButton productId={item._id} />
        </div>
      </div>
    </div>
  );
}
