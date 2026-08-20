"use client";

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
import {
  addAddressAction,
  type AddressMutationState,
} from "@/lib/actions/addresses";

const INITIAL_STATE: AddressMutationState = null;

export function AddAddressForm() {
  const t = useTranslations("common");
  const tAddress = useTranslations("common.addresses");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    addAddressAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="address-name">{tAddress("name")}</FieldLabel>
          <Input id="address-name" name="name" disabled={pending} />
          {state?.fieldErrors?.name ? (
            <FieldError>{tAddress(`errors.${state.fieldErrors.name}`)}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="address-phone">{tAddress("phone")}</FieldLabel>
          <Input id="address-phone" name="phone" disabled={pending} />
          {state?.fieldErrors?.phone ? (
            <FieldError>{tAddress(`errors.${state.fieldErrors.phone}`)}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="address-city">{tAddress("city")}</FieldLabel>
          <Input id="address-city" name="city" disabled={pending} />
          {state?.fieldErrors?.city ? (
            <FieldError>{tAddress(`errors.${state.fieldErrors.city}`)}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="address-details">{tAddress("details")}</FieldLabel>
          <Input
            id="address-details"
            name="details"
            disabled={pending}
          />
          {state?.fieldErrors?.details ? (
            <FieldError>{tAddress(`errors.${state.fieldErrors.details}`)}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {state?.error === "failed" ? (
        <FieldError>
          {tAddress("failed")}
        </FieldError>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? tAddress("adding") : t("addresses.add")}
      </Button>
    </form>
  );
}
