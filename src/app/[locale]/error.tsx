"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ErrorView({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useTranslations("common.error");

  useEffect(() => {
    console.error(error.digest ?? error.name);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[var(--token-measure-body)] flex-col gap-4 px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("title")}
      </h1>
      <p role="alert" className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("body")}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex w-fit items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
      >
        {t("retry")}
      </button>
    </div>
  );
}
