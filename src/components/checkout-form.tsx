"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Address } from "@/lib/api/addresses";
import {
  checkoutAction,
  type CheckoutState,
} from "@/lib/actions/orders";

const INITIAL_STATE: CheckoutState = null;

export function CheckoutForm({ addresses }: { addresses: Address[] }) {
  const t = useTranslations("common.checkout");
  const locale = useLocale();
  const hasAddresses = addresses.length > 0;
  const [mode, setMode] = useState<"saved" | "manual">(
    hasAddresses ? "saved" : "manual",
  );
  const [selectedId, setSelectedId] = useState(addresses[0]?._id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [state, formAction, pending] = useActionState(
    checkoutAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      {hasAddresses ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("saved")}
            className={`rounded-sm border px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
              mode === "saved"
                ? "border-ink bg-ink text-bone"
                : "border-line text-mute hover:text-ink"
            }`}
          >
            {t("useSaved")}
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-sm border px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
              mode === "manual"
                ? "border-ink bg-ink text-bone"
                : "border-line text-mute hover:text-ink"
            }`}
          >
            {t("enterNew")}
          </button>
        </div>
      ) : null}

      {mode === "saved" && hasAddresses ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
            {t("shippingAddress")}
          </legend>
          {addresses.map((address) => {
            const checked = selectedId === address._id;

            return (
              <label
                key={address._id}
                className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
                  checked
                    ? "border-ink bg-bone"
                    : "border-line bg-paper hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="addressId"
                  value={address._id}
                  checked={checked}
                  onChange={() => setSelectedId(address._id)}
                  className="mt-1"
                  disabled={pending}
                />
                <span className="min-w-0">
                  <span className="block text-[length:var(--token-label-size)] font-semibold tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
                    {address.name}
                  </span>
                  <span className="mt-1 block text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
                    {address.details}
                  </span>
                  <span className="mt-1 block text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
                    {address.city} · {address.phone}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      ) : (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="checkout-details">{t("details")}</FieldLabel>
            <Input
              id="checkout-details"
              name="details"
              disabled={pending}
              autoComplete="street-address"
            />
            {state?.fieldErrors?.details ? (
              <FieldError>{t(`errors.${state.fieldErrors.details}`)}</FieldError>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-phone">{t("phone")}</FieldLabel>
            <Input
              id="checkout-phone"
              name="phone"
              disabled={pending}
              autoComplete="tel"
              inputMode="tel"
            />
            {state?.fieldErrors?.phone ? (
              <FieldError>{t(`errors.${state.fieldErrors.phone}`)}</FieldError>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-city">{t("city")}</FieldLabel>
            <Input
              id="checkout-city"
              name="city"
              disabled={pending}
              autoComplete="address-level2"
            />
            {state?.fieldErrors?.city ? (
              <FieldError>{t(`errors.${state.fieldErrors.city}`)}</FieldError>
            ) : null}
          </Field>
        </FieldGroup>
      )}

      {!hasAddresses ? (
        <p className="text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
          {t("noSavedHint")}{" "}
          <Link
            href="/addresses"
            className="underline underline-offset-4 hover:text-ink"
          >
            {t("manageAddresses")}
          </Link>
        </p>
      ) : null}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
          {t("paymentMethod")}
        </legend>
        <label
          className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
            paymentMethod === "cash"
              ? "border-ink bg-bone"
              : "border-line bg-paper hover:border-ink/30"
          }`}
        >
          <input
            type="radio"
            name="paymentMethodUi"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="mt-1"
            disabled={pending}
          />
          <span className="min-w-0">
            <span className="block text-[length:var(--token-label-size)] font-semibold tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
              {t("cashOnDelivery")}
            </span>
            <span className="mt-1 block text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
              {t("cashHint")}
            </span>
          </span>
        </label>
        <label
          className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] ${
            paymentMethod === "card"
              ? "border-ink bg-bone"
              : "border-line bg-paper hover:border-ink/30"
          }`}
        >
          <input
            type="radio"
            name="paymentMethodUi"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="mt-1"
            disabled={pending}
          />
          <span className="min-w-0">
            <span className="block text-[length:var(--token-label-size)] font-semibold tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
              {t("onlinePayment")}
            </span>
            <span className="mt-1 block text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
              {t("cardHint")}
            </span>
          </span>
        </label>
      </fieldset>

      {state?.error === "empty" ? <FieldError>{t("emptyCart")}</FieldError> : null}
      {state?.error === "noAddress" ? (
        <FieldError>{t("noAddress")}</FieldError>
      ) : null}
      {state?.error === "failed" ? <FieldError>{t("failed")}</FieldError> : null}
      {state?.error === "invalid" && !state.fieldErrors ? (
        <FieldError>{t("invalid")}</FieldError>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending || (mode === "saved" && !selectedId)}
        aria-busy={pending}
      >
        {pending
          ? paymentMethod === "card"
            ? t("redirecting")
            : t("placing")
          : paymentMethod === "card"
            ? t("payOnline")
            : t("placeOrder")}
      </Button>
    </form>
  );
}
