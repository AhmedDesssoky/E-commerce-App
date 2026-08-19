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
import { signInAction, type SignInState } from "@/lib/actions/auth";
import { signInSchema, type SignInValues } from "@/lib/auth/sign-in-schema";

const errorCodes = ["email", "passwordRequired"] as const;

type SignInErrorCode = (typeof errorCodes)[number];

function isSignInErrorCode(value: string): value is SignInErrorCode {
  return (errorCodes as readonly string[]).includes(value);
}

const submitCopy = {
  invalid: "invalid",
  credentials: "credentials",
  failed: "signInFailed",
} as const;

const INITIAL_STATE: SignInState = null;

export function SignInForm({ next }: { next: string | null }) {
  const t = useTranslations("common");
  const tAuth = useTranslations("common.auth");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(
    signInAction,
    INITIAL_STATE,
  );
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function messageFor(code: string | undefined) {
    if (!code || !isSignInErrorCode(code)) {
      return undefined;
    }

    return tAuth(`errors.${code}`);
  }

  const submitMessage = state?.error ? tAuth(submitCopy[state.error]) : undefined;

  const signUpHref = next
    ? { pathname: "/sign-up" as const, query: { next } }
    : "/sign-up";

  return (
    <form
      id="sign-in-form"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        const data = new FormData();
        data.set("email", values.email);
        data.set("password", values.password);
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
        <SignInField
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
        <SignInField
          control={form.control}
          name="password"
          label={tAuth("password")}
          type="password"
          autoComplete="current-password"
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
        {pending ? tAuth("signingIn") : t("nav.signIn")}
      </Button>
      <FieldDescription>
        {tAuth("noAccount")} <Link href={signUpHref}>{t("nav.signUp")}</Link>
      </FieldDescription>
    </form>
  );
}

function SignInField({
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
  control: Control<SignInValues>;
  name: keyof SignInValues;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
  spellCheck?: boolean;
  messageFor: (code: string | undefined) => string | undefined;
}) {
  const id = `sign-in-${name}`;

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
