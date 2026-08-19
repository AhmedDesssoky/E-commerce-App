"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronEndIcon, ChevronStartIcon } from "@/components/nav-icons";
import sliderProduce from "@/assets/images/slider-image-1.jpeg";
import sliderWafers from "@/assets/images/slider-image-2.jpeg";
import sliderCookies from "@/assets/images/slider-image-3.jpeg";

export function HomeHeroSlider() {
  const t = useTranslations("common");
  const locale = useLocale();
  const radios = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);
  const slides = [
    { src: sliderProduce, alt: t("home.slideProduce") },
    { src: sliderWafers, alt: t("home.slideWafers") },
    { src: sliderCookies, alt: t("home.slideCookies") },
  ];

  function wrapIndex(index: number) {
    return (index + slides.length) % slides.length;
  }

  function move(step: number, focus = false) {
    setActive((index) => {
      const next = wrapIndex(index + step);
      if (focus) {
        queueMicrotask(() => radios.current[next]?.focus());
      }
      return next;
    });
  }

  function onSliderKeyDown(event: KeyboardEvent<HTMLElement>) {
    const rtl = locale === "ar";
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(rtl ? -1 : 1, true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(rtl ? 1 : -1, true);
    }
  }

  return (
    <div
      role="region"
      aria-label={t("home.slider")}
      className="relative min-h-[28rem] bg-bone md:min-h-full"
    >
      {slides.map((slide, index) => {
        const selected = index === active;
        return (
          <div
            key={slide.src.src}
            aria-hidden={!selected}
            className={`absolute inset-0 transition-opacity duration-[var(--token-duration)] ease-[var(--token-ease)] motion-reduce:transition-none ${
              selected ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => move(-1)}
        aria-label={t("home.previous")}
        className="absolute start-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-sm border border-line bg-bone text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-paper"
      >
        <ChevronStartIcon />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label={t("home.next")}
        className="absolute end-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-sm border border-line bg-bone text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-paper"
      >
        <ChevronEndIcon />
      </button>

      <div
        role="radiogroup"
        aria-label={t("home.slides")}
        className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2"
      >
        {slides.map((slide, index) => {
          const selected = index === active;
          return (
            <button
              key={slide.src.src}
              ref={(node) => {
                radios.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              aria-label={t("home.slide", { index: index + 1 })}
              onClick={() => setActive(index)}
              onKeyDown={onSliderKeyDown}
              className="flex size-8 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full ${
                  selected ? "bg-ink" : "bg-line"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
