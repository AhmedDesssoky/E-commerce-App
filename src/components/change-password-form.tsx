"use client";

import { useActionState, useEffect, useRef } from "react";
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
  changePasswordAction,
  type PasswordMutationState,
} from "@/lib/actions/profile";

const INITIAL_STATE: PasswordMutationState = null;

export function ChangePasswordForm() {
  const t = useTranslations("common.account");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="current-password">{t("currentPassword")}</FieldLabel>
          <Input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.currentPassword ? (
            <FieldError>{t("errors.currentPassword")}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password">{t("newPassword")}</FieldLabel>
          <Input
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.password ? (
            <FieldError>{t("errors.passwordMin")}</FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">{t("rePassword")}</FieldLabel>
          <Input
            id="confirm-password"
            name="rePassword"
            type="password"
            autoComplete="new-password"
            disabled={pending}
          />
          {state && "fieldErrors" in state && state.fieldErrors?.rePassword ? (
            <FieldError>{t("errors.rePassword")}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {state && "error" in state && state.error === "current" ? (
        <FieldError>{t("currentFailed")}</FieldError>
      ) : null}
      {state && "error" in state && state.error === "failed" ? (
        <FieldError>{t("passwordFailed")}</FieldError>
      ) : null}
      {state && "ok" in state && state.ok && !pending ? (
        <p
          role="status"
          className="text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-ink"
        >
          {t("passwordUpdated")}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending} aria-busy={pending}>
        {pending ? t("changing") : t("changePassword")}
      </Button>
    </form>
  );
}
