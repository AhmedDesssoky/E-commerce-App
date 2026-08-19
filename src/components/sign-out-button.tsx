"use client";

import { useLocale, useTranslations } from "next-intl";
import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common.nav");
  const locale = useLocale();

  return (
    <form
      action={signOutAction}
      onSubmit={onNavigate}
    >
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        className="cursor-pointer relative inline-flex items-center rounded-sm py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
      >
        {t("signOut")}
      </button>
    </form>
  );
}
