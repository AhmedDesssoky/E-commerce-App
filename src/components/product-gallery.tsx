"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const t = useTranslations("common.product");
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const thumbs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="aspect-[var(--token-ratio-product)] rounded-md border border-line bg-paper" />
    );
  }

  function wrapIndex(index: number) {
    return (index + images.length) % images.length;
  }

  function move(step: number) {
    setActive((index) => {
      const next = wrapIndex(index + step);
      queueMicrotask(() => thumbs.current[next]?.focus());
      return next;
    });
  }

  function onThumbKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const rtl = locale === "ar";
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(rtl ? -1 : 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(rtl ? 1 : -1);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[var(--token-ratio-product)] overflow-hidden rounded-md border border-line bg-bone">
        <Image
          src={current}
          alt={t("imageOf", { title, index: active + 1 })}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div
          role="radiogroup"
          aria-label={t("gallery")}
          className="flex gap-2 overflow-x-auto"
        >
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={src}
                ref={(node) => {
                  thumbs.current[index] = node;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                aria-label={t("image", { index: index + 1 })}
                onClick={() => setActive(index)}
                onKeyDown={onThumbKeyDown}
                className={`relative size-16 shrink-0 overflow-hidden rounded-sm border bg-paper ${
                  selected ? "border-ink" : "border-line"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
