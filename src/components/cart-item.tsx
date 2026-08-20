"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrashIcon } from "@/components/nav-icons";
import type { CartProduct } from "@/lib/api/cart";
import {
  removeCartItemAction,
  updateCartItemAction,
  type CartMutationState,
} from "@/lib/actions/cart";

function QtyButton({
  label,
  disabled,
  children,
}: {
  label: string;
  disabled: boolean;
  children: string;
}) {
  return (
    <button
      type="submit"
      aria-label={label}
      disabled={disabled}
      className="inline-flex size-8 items-center justify-center rounded-sm border border-line text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-line disabled:opacity-40 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}

export function CartItem({ item }: { item: CartProduct }) {
  const t = useTranslations("common.cart");
  const locale = useLocale();
  const [, updateAction, updatePending] = useActionState<CartMutationState, FormData>(
    updateCartItemAction,
    null,
  );
  const [, removeAction, removePending] = useActionState<CartMutationState, FormData>(
    removeCartItemAction,
    null,
  );

  const pending = updatePending || removePending;
  const lineTotal = item.price * item.count;

  return (
    <div className={`flex gap-4 py-6 ${pending ? "opacity-60 pointer-events-none" : ""}`}>
      <Link
        href={{ pathname: "/products/[id]", params: { id: item.product._id } }}
        className="shrink-0"
      >
        <div className="relative size-24 overflow-hidden rounded-md border border-line bg-paper sm:size-28">
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
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
              href={{ pathname: "/products/[id]", params: { id: item.product._id } }}
              className="line-clamp-2 text-[length:var(--token-title-size)] font-medium leading-[var(--token-title-line)] text-ink hover:underline"
            >
              {item.product.title}
            </Link>
            {item.product.brand && (
              <p className="mt-0.5 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
                {item.product.brand.name}
              </p>
            )}
          </div>
          <p className="shrink-0 text-[length:var(--token-price-size)] font-semibold tabular-nums text-ink">
            {lineTotal.toLocaleString(locale, { style: "currency", currency: "EGP" })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <form action={updateAction}>
              <input type="hidden" name="productId" value={item.product._id} />
              <input type="hidden" name="count" value={item.count - 1} />
              <input type="hidden" name="locale" value={locale} />
              <QtyButton label={`−`} disabled={pending || item.count <= 1}>
                −
              </QtyButton>
            </form>

            <span className="min-w-8 text-center text-[length:var(--token-label-size)] font-medium tabular-nums text-ink">
              {item.count}
            </span>

            <form action={updateAction}>
              <input type="hidden" name="productId" value={item.product._id} />
              <input type="hidden" name="count" value={item.count + 1} />
              <input type="hidden" name="locale" value={locale} />
              <QtyButton label={`+`} disabled={pending}>
                +
              </QtyButton>
            </form>
          </div>

          <form action={removeAction}>
            <input type="hidden" name="productId" value={item.product._id} />
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-all duration-[var(--token-duration)] ease-[var(--token-ease)] hover:border-sale/40 hover:bg-sale/10 hover:text-sale disabled:opacity-40"
            >
              <TrashIcon />
              {removePending ? t("removing") : t("remove")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
