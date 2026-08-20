"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  replaceAddressAction,
  type AddressMutationState,
} from "@/lib/actions/addresses";

const INITIAL_STATE: AddressMutationState = null;

export function EditAddressForm({ address }: { address: Address }) {
  const t = useTranslations("common.addresses");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    replaceAddressAction,
    INITIAL_STATE,
  );

  return (
    <div className="space-y-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm border border-line px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
        >
          {t("edit")}
        </button>
      ) : (
        <form action={formAction} noValidate className="rounded-md border border-line bg-paper p-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="oldAddressId" value={address._id} />
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`edit-name-${address._id}`}>{t("name")}</FieldLabel>
              <Input
                id={`edit-name-${address._id}`}
                name="name"
                defaultValue={address.name}
                disabled={pending}
              />
              {state?.fieldErrors?.name ? (
                <FieldError>{t(`errors.${state.fieldErrors.name}`)}</FieldError>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-phone-${address._id}`}>{t("phone")}</FieldLabel>
              <Input
                id={`edit-phone-${address._id}`}
                name="phone"
                defaultValue={address.phone}
                disabled={pending}
              />
              {state?.fieldErrors?.phone ? (
                <FieldError>{t(`errors.${state.fieldErrors.phone}`)}</FieldError>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-city-${address._id}`}>{t("city")}</FieldLabel>
              <Input
                id={`edit-city-${address._id}`}
                name="city"
                defaultValue={address.city}
                disabled={pending}
              />
              {state?.fieldErrors?.city ? (
                <FieldError>{t(`errors.${state.fieldErrors.city}`)}</FieldError>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-details-${address._id}`}>{t("details")}</FieldLabel>
              <Input
                id={`edit-details-${address._id}`}
                name="details"
                defaultValue={address.details}
                disabled={pending}
              />
              {state?.fieldErrors?.details ? (
                <FieldError>{t(`errors.${state.fieldErrors.details}`)}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>

          {state?.error === "failed" ? (
            <FieldError>
              {t("failed")}
            </FieldError>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={pending} aria-busy={pending}>
              {pending ? t("saving") : t("save")}
            </Button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm border border-line px-3 py-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
