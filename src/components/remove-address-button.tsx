"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TrashIcon } from "@/components/nav-icons";
import {
  removeAddressAction,
  type AddressMutationState,
} from "@/lib/actions/addresses";

const INITIAL_STATE: AddressMutationState = null;

export function RemoveAddressButton({ addressId }: { addressId: string }) {
  const t = useTranslations("common.addresses");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    removeAddressAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="addressId" value={addressId} />
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
        <span className="sr-only">{t("failed")}</span>
      ) : null}
    </form>
  );
}
