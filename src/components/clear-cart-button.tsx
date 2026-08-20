"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clearCartAction, type CartMutationState } from "@/lib/actions/cart";

export function ClearCartButton() {
  const t = useTranslations("common.cart");
  const locale = useLocale();
  const [, action, pending] = useActionState<CartMutationState, FormData>(
    clearCartAction,
    null,
  );

  return (
    <form action={action}>
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        disabled={pending}
        className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-sale disabled:opacity-40"
      >
        {pending ? t("clearing") : t("clear")}
      </button>
    </form>
  );
}
