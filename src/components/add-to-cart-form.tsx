"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  addToCartAction,
  type AddToCartState,
} from "@/lib/actions/cart";

const INITIAL_STATE: AddToCartState = null;

export function AddToCartForm({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const t = useTranslations("common.product");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    addToCartAction,
    INITIAL_STATE,
  );

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
