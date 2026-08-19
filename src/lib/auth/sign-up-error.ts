export type SignUpActionError = "invalid" | "exists" | "failed";

export function signUpErrorFromRoute(
  status: number,
  message?: string,
): Exclude<SignUpActionError, "invalid"> {
  const normalized = message?.trim().toLowerCase() ?? "";

  if (status === 409 || normalized.includes("already exists")) {
    return "exists";
  }

  return "failed";
}
