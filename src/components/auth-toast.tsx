"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { parseAuthFlash } from "@/lib/auth/auth-flash";

function AuthToastListener() {
  const searchParams = useSearchParams();
  const tAuth = useTranslations("common.auth");
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const flash = parseAuthFlash(searchParams.get("auth"));

    if (!flash) {
      shown.current = null;
      return;
    }

    const key = `${searchParams.toString()}:${flash}`;

    if (shown.current === key) {
      return;
    }

    shown.current = key;

    toast.add({
      type: "success",
      title:
        flash === "signed-in"
          ? tAuth("signedInSuccess")
          : tAuth("signedUpSuccess"),
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    const next =
      url.pathname +
      (url.searchParams.size ? `?${url.searchParams.toString()}` : "") +
      url.hash;

    window.history.replaceState(window.history.state, "", next);
  }, [searchParams, tAuth]);

  return null;
}

export function AuthToast() {
  return (
    <Suspense fallback={null}>
      <AuthToastListener />
    </Suspense>
  );
}
