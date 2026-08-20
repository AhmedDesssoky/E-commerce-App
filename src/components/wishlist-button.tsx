"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HeartIcon, TrashIcon } from "@/components/nav-icons";
import {
  addToWishlistAction,
  removeFromWishlistAction,
  type WishlistMutationState,
} from "@/lib/actions/wishlist";

const INITIAL_STATE: WishlistMutationState = null;

export function AddToWishlistButton({
  productId,
  added = false,
}: {
  productId: string;
  added?: boolean;
}) {
  const t = useTranslations("common.wishlist");
  const locale = useLocale();
  const action = added ? removeFromWishlistAction : addToWishlistAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        aria-label={added ? t("remove") : t("add")}
        aria-busy={pending}
        className={`inline-flex size-9 items-center justify-center rounded-full border shadow-sm transition-all duration-[var(--token-duration)] ease-[var(--token-ease)] hover:scale-110 ${
          added
            ? "border-sale bg-sale/10 text-sale hover:bg-sale/20"
            : "border-line bg-bone text-ink hover:bg-paper"
        }`}
      >
        <HeartIcon filled={added} />
      </button>
      {state?.error ? (
        <span className="sr-only">{t("mutationFailed")}</span>
      ) : null}
    </form>
  );
}

export function RemoveFromWishlistButton({
  productId,
}: {
  productId: string;
}) {
  const t = useTranslations("common.wishlist");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    removeFromWishlistAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-all duration-[var(--token-duration)] ease-[var(--token-ease)] hover:border-sale/40 hover:bg-sale/10 hover:text-sale disabled:opacity-40"
      >
        <TrashIcon />
        {pending ? t("removing") : t("remove")}
      </button>
      {state?.error ? (
        <span className="sr-only">{t("mutationFailed")}</span>
      ) : null}
    </form>
  );
}
