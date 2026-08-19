"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronEndIcon, ChevronStartIcon } from "@/components/nav-icons";
import type { Category } from "@/lib/api/catalog";

const EDGE_PX = 8;

const controlClassName =
  "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-sm border border-line bg-bone text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bone";

export function CategorySlider({ categories }: { categories: Category[] }) {
  const t = useTranslations("common");
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [overflowing, setOverflowing] = useState(false);

  function updateEdges() {
    const track = trackRef.current;
    const items = track?.querySelectorAll("li");
    const first = items?.[0];
    const last = items?.[items.length - 1];

    if (
      !track ||
      !(first instanceof HTMLElement) ||
      !(last instanceof HTMLElement)
    ) {
      setAtStart(true);
      setAtEnd(true);
      setOverflowing(false);
      return;
    }

    const canOverflow = track.scrollWidth > track.clientWidth + EDGE_PX;
    setOverflowing(canOverflow);

    if (!canOverflow) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    const trackBox = track.getBoundingClientRect();
    const firstBox = first.getBoundingClientRect();
    const lastBox = last.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === "rtl";

    if (rtl) {
      setAtStart(firstBox.right >= trackBox.right - EDGE_PX);
      setAtEnd(lastBox.left <= trackBox.left + EDGE_PX);
      return;
    }

    setAtStart(firstBox.left >= trackBox.left - EDGE_PX);
    setAtEnd(lastBox.right <= trackBox.right + EDGE_PX);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [categories]);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !(card instanceof HTMLElement)) {
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(track).gap) || 16;
    const delta = card.getBoundingClientRect().width + gap;
    const rtl = getComputedStyle(track).direction === "rtl";
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      left: (rtl ? -direction : direction) * delta,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  function onControlKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const rtl = getComputedStyle(trackRef.current ?? document.body).direction === "rtl";
    if (event.key === "ArrowRight") {
      scrollByCard(rtl ? -1 : 1);
      return;
    }
    scrollByCard(rtl ? 1 : -1);
  }

  return (
    <div
      role="region"
      aria-label={t("nav.categories")}
      className="relative min-w-0"
    >
      <ul
        ref={trackRef}
        className="flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4"
      >
        {categories.map((category) => (
          <li
            key={category._id}
            className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23%]"
          >
            <Link
              href="/categories"
              className="relative block overflow-hidden rounded-md border border-line bg-bone"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, (min-width: 640px) 45vw, 70vw"
                  className="object-cover"
                />
              </div>
              <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-bone px-4 py-3 text-[length:var(--token-title-size)] font-medium leading-[var(--token-title-line)] text-ink">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {overflowing && !atStart ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 w-12 bg-[linear-gradient(to_inline-end,var(--token-paper),transparent)]"
        />
      ) : null}
      {overflowing && !atEnd ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 w-12 bg-[linear-gradient(to_inline-start,var(--token-paper),transparent)]"
        />
      ) : null}

      {overflowing ? (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            onKeyDown={onControlKeyDown}
            disabled={atStart}
            aria-label={t("home.previous")}
            className={`${controlClassName} start-3`}
          >
            <ChevronStartIcon />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            onKeyDown={onControlKeyDown}
            disabled={atEnd}
            aria-label={t("home.next")}
            className={`${controlClassName} end-3`}
          >
            <ChevronEndIcon />
          </button>
        </>
      ) : null}
    </div>
  );
}
