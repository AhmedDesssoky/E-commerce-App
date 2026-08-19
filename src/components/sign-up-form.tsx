"use client";

import type { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import { startTransition, useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpAction, type SignUpState } from "@/lib/actions/auth";
import { signUpSchema, type SignUpValues } from "@/lib/auth/sign-up-schema";

const errorCodes = [
  "nameMin",
  "email",
  "passwordMin",
  "rePassword",
  "phone",
] as const;

type SignUpErrorCode = (typeof errorCodes)[number];

function isSignUpErrorCode(value: string): value is SignUpErrorCode {
  return (errorCodes as readonly string[]).includes(value);
}

const INITIAL_STATE: SignUpState = null;

export function SignUpForm({ next }: { next: string | null }) {
  const t = useTranslations("common");
  const tAuth = useTranslations("common.auth");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    signUpAction,
    INITIAL_STATE,
  );
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  function messageFor(code: string | undefined) {
    if (!code || !isSignUpErrorCode(code)) {
      return undefined;
    }

    return tAuth(`errors.${code}`);
  }

  const submitMessage = state?.error ? tAuth(state.error) : undefined;

  const signInHref = next
    ? { pathname: "/sign-in" as const, query: { next } }
    : "/sign-in";

  return (
    <form
      id="sign-up-form"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        const data = new FormData();
        data.set("name", values.name);
        data.set("email", values.email);
        data.set("password", values.password);
        data.set("rePassword", values.rePassword);
        data.set("phone", values.phone);
        data.set("locale", locale);
        if (next) {
          data.set("next", next);
        }

        startTransition(() => {
          formAction(data);
        });
      })}
      className="flex flex-col gap-5"
    >
      <FieldGroup>
        <SignUpField
          control={form.control}
          name="name"
          label={tAuth("name")}
          autoComplete="name"
          disabled={pending}
          messageFor={messageFor}
        />
        <SignUpField
          control={form.control}
          name="email"
          label={tAuth("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          disabled={pending}
          messageFor={messageFor}
        />
        <SignUpField
          control={form.control}
          name="phone"
          label={tAuth("phone")}
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          disabled={pending}
          messageFor={messageFor}
        />
        <SignUpField
          control={form.control}
          name="password"
          label={tAuth("password")}
          type="password"
          autoComplete="new-password"
          disabled={pending}
          messageFor={messageFor}
        />
        <SignUpField
          control={form.control}
          name="rePassword"
          label={tAuth("rePassword")}
          type="password"
          autoComplete="new-password"
          disabled={pending}
          messageFor={messageFor}
        />
      </FieldGroup>
      {submitMessage && !pending ? (
        <p
          role="alert"
          className="text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-sale"
        >
          {submitMessage}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? tAuth("creating") : t("nav.signUp")}
      </Button>
      <FieldDescription>
        {tAuth("hasAccount")} <Link href={signInHref}>{t("nav.signIn")}</Link>
      </FieldDescription>
    </form>
  );
}

function SignUpField({
  control,
  name,
  label,
  type,
  autoComplete,
  inputMode,
  disabled,
  spellCheck,
  messageFor,
}: {
  control: Control<SignUpValues>;
  name: keyof SignUpValues;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  spellCheck?: boolean;
  messageFor: (code: string | undefined) => string | undefined;
}) {
  const id = `sign-up-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            disabled={disabled}
            spellCheck={spellCheck}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid ? (
            <FieldError>{messageFor(fieldState.error?.message)}</FieldError>
          ) : null}
        </Field>
      )}
    />
  );
}
