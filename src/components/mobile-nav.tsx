"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authLinks, shopLinks } from "@/components/site-links";
import { CartIcon, CloseIcon, HeartIcon, MenuIcon } from "@/components/nav-icons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/nav-link";
import { SignOutButton } from "@/components/sign-out-button";

export function MobileNav({
  isLoggedIn,
  cartCount = 0,
  wishlistCount = 0,
}: {
  isLoggedIn: boolean;
  cartCount?: number;
  wishlistCount?: number;
}) {
  const t = useTranslations("common");
  const drawerId = useId();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function openDrawer() {
    drawerRef.current?.showModal();
    setOpen(true);
  }

  function closeDrawer() {
    drawerRef.current?.close();
    setOpen(false);
  }

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }

    function handleClose() {
      setOpen(false);
    }

    drawer.addEventListener("close", handleClose);
    return () => drawer.removeEventListener("close", handleClose);
  }, []);

  const countLabel = (value: number) => (value > 99 ? "99+" : String(value));

  return (
    <>
      <div className="ms-auto flex items-center gap-1 md:hidden">
        {isLoggedIn && (
          <Link
            href="/wishlist"
            className="relative inline-flex size-10 items-center justify-center rounded-sm text-ink"
            aria-label={t("nav.wishlist")}
          >
            <HeartIcon />
            {wishlistCount > 0 ? (
              <span className="absolute -end-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-semibold leading-none text-bone tabular-nums">
                {countLabel(wishlistCount)}
              </span>
            ) : null}
          </Link>
        )}
        {isLoggedIn && (
          <Link
            href="/cart"
            className="relative inline-flex size-10 items-center justify-center rounded-sm text-ink"
            aria-label={t("nav.cart")}
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute -end-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-semibold leading-none text-bone tabular-nums">
                {countLabel(cartCount)}
              </span>
            ) : null}
          </Link>
        )}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-sm text-ink"
          aria-label={t("nav.openMenu")}
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={openDrawer}
        >
          <MenuIcon />
        </button>
      </div>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="nav-drawer"
        aria-label={t("nav.primary")}
      >
        <div className="flex h-full w-full">
          <button
            type="button"
            className="min-w-0 flex-1"
            aria-label={t("nav.closeMenu")}
            onClick={closeDrawer}
          />
          <div className="flex h-full w-[min(20rem,100%)] flex-col overflow-y-auto overscroll-contain border-s border-line bg-bone">
            <div className="flex h-16 items-center justify-end px-4">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-sm text-ink"
                aria-label={t("nav.closeMenu")}
                onClick={closeDrawer}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-5 px-6 pb-8">
              {shopLinks.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onNavigate={closeDrawer}
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              ))}
              <div className="h-px bg-line" />
              {isLoggedIn ? (
                <>
                  <NavLink href="/account" onNavigate={closeDrawer}>
                    {t("nav.account")}
                  </NavLink>
                  <NavLink href="/orders" onNavigate={closeDrawer}>
                    {t("nav.orders")}
                  </NavLink>
                  <NavLink href="/addresses" onNavigate={closeDrawer}>
                    {t("nav.addresses")}
                  </NavLink>
                  <NavLink href="/wishlist" onNavigate={closeDrawer}>
                    {t("nav.wishlist")}
                    {wishlistCount > 0 ? ` (${countLabel(wishlistCount)})` : ""}
                  </NavLink>
                  <NavLink href="/cart" onNavigate={closeDrawer}>
                    {t("nav.cart")}
                    {cartCount > 0 ? ` (${countLabel(cartCount)})` : ""}
                  </NavLink>
                  <SignOutButton onNavigate={closeDrawer} />
                </>
              ) : (
                authLinks.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    onNavigate={closeDrawer}
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                ))
              )}
              <div className="flex items-center gap-3">
                <ThemeToggle onNavigate={closeDrawer} />
                <LocaleSwitcher onNavigate={closeDrawer} />
              </div>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
