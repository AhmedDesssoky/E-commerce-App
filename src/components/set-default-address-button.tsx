"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  setDefaultAddressAction,
  type AddressMutationState,
} from "@/lib/actions/addresses";

const INITIAL_STATE: AddressMutationState = null;

export function SetDefaultAddressButton({
  addressId,
  isDefault,
}: {
  addressId: string;
  isDefault: boolean;
}) {
  const t = useTranslations("common.addresses");
  const locale = useLocale();
  const [, formAction, pending] = useActionState(
    setDefaultAddressAction,
    INITIAL_STATE,
  );

  if (isDefault) {
    return (
      <span className="inline-flex rounded-full bg-sale px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-bone">
        {t("default")}
      </span>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="addressId" value={addressId} />
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-line px-2.5 py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink disabled:opacity-40"
      >
        {pending ? t("settingDefault") : t("setDefault")}
      </button>
    </form>
  );
}
