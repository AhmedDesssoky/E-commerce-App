"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CartIcon } from "@/components/nav-icons";
import {
  addToCartAction,
  type AddToCartState,
} from "@/lib/actions/cart";

const INITIAL_STATE: AddToCartState = null;

export function AddToCartForm({
  productId,
  disabled,
  variant = "full",
}: {
  productId: string;
  disabled: boolean;
  variant?: "full" | "icon";
}) {
  const t = useTranslations("common.product");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    addToCartAction,
    INITIAL_STATE,
  );

  if (variant === "icon") {
    return (
      <form action={formAction}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          disabled={disabled || pending}
          aria-label={t("addToCart")}
          aria-busy={pending}
          className="inline-flex size-9 items-center justify-center rounded-full bg-saffron text-bone shadow-sm transition-all duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep hover:scale-110 disabled:cursor-not-allowed disabled:bg-line disabled:text-mute disabled:hover:scale-100 disabled:shadow-none"
        >
          {pending ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4 animate-spin">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <CartIcon />
          )}
        </button>
      </form>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="locale" value={locale} />
      {state?.error ? (
        <p role="alert" className="mb-2 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-sale">
          {t("addFailed")}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        aria-busy={pending}
        className="inline-flex w-full items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-mute disabled:hover:bg-line"
      >
        {pending ? t("adding") : t("addToCart")}
      </button>
    </form>
  );
}
