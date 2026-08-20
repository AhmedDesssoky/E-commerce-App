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
import type { LoggedUser } from "@/lib/api/users";
import {
  updateProfileAction,
  type ProfileMutationState,
} from "@/lib/actions/profile";

const INITIAL_STATE: ProfileMutationState = null;

export function UpdateProfileForm({ user }: { user: LoggedUser }) {
  const t = useTranslations("common.account");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-name">{t("name")}</FieldLabel>
          <Input
            id="profile-name"
            name="name"
            defaultValue={user.name}
            autoComplete="name"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.name ? (
            <FieldError>{t("errors.nameMin")}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-email">{t("email")}</FieldLabel>
          <Input
            id="profile-email"
            name="email"
            type="email"
            defaultValue={user.email}
            autoComplete="email"
            inputMode="email"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.email ? (
            <FieldError>{t("errors.email")}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-phone">{t("phone")}</FieldLabel>
          <Input
            id="profile-phone"
            name="phone"
            defaultValue={user.phone}
            autoComplete="tel"
            inputMode="tel"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.phone ? (
            <FieldError>{t("errors.phone")}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {state && "error" in state && state.error === "exists" ? (
        <FieldError>{t("exists")}</FieldError>
      ) : null}
      {state && "error" in state && state.error === "failed" ? (
        <FieldError>{t("failed")}</FieldError>
      ) : null}
      {state && "ok" in state && state.ok && !pending ? (
        <p
          role="status"
          className="text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-ink"
        >
          {t("updated")}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending} aria-busy={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
