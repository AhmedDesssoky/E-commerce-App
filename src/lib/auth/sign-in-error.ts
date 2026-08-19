export type SignInActionError = "invalid" | "credentials" | "failed";

export function signInErrorFromRoute(
  status: number,
  message?: string,
): Exclude<SignInActionError, "invalid"> {
  const normalized = message?.trim().toLowerCase() ?? "";

  if (status === 401 || normalized.includes("incorrect email or password")) {
    return "credentials";
  }

  return "failed";
}
