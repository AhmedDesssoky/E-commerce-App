"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authLinks, shopLinks } from "@/components/site-links";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/nav-icons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavLink } from "@/components/nav-link";
import { SignOutButton } from "@/components/sign-out-button";

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
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

  return (
    <>
      <div className="ms-auto flex items-center gap-1 md:hidden">
        {isLoggedIn && (
          <Link
            href="/cart"
            className="inline-flex size-10 items-center justify-center rounded-sm text-ink"
            aria-label={t("nav.cart")}
          >
            <CartIcon />
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
                  <NavLink href="/cart" onNavigate={closeDrawer}>
                    {t("nav.cart")}
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
              <LocaleSwitcher onNavigate={closeDrawer} />
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
