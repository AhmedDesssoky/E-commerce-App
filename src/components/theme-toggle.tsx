"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/nav-icons";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common.theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center rounded-sm border border-line bg-paper p-0.5"
    >
      <button
        type="button"
        onClick={() => {
          setTheme("light");
          onNavigate?.();
        }}
        aria-label={t("light")}
        aria-pressed={mounted ? !isDark : undefined}
        className={`inline-flex size-7 items-center justify-center rounded-[6px] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
          mounted && !isDark ? "bg-ink text-bone" : "text-mute hover:text-ink"
        }`}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        onClick={() => {
          setTheme("dark");
          onNavigate?.();
        }}
        aria-label={t("dark")}
        aria-pressed={mounted ? isDark : undefined}
        className={`inline-flex size-7 items-center justify-center rounded-[6px] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
          mounted && isDark ? "bg-ink text-bone" : "text-mute hover:text-ink"
        }`}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
