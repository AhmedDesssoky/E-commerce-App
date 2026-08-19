import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";
import type { SignInValues } from "@/lib/auth/sign-in-schema";
import type { SignUpValues } from "@/lib/auth/sign-up-schema";

const AUTH_API = `${ROUTE_ORIGIN}/api/v1`;

const authTokenSchema = z.object({
  token: z.string().min(1),
});

const authFailSchema = z.object({
  message: z.string().optional(),
});

function routeApiMessage(payload: unknown) {
  const parsed = authFailSchema.safeParse(payload);
  const message = parsed.success ? parsed.data.message?.trim() : undefined;

  if (!message || message.toLowerCase() === "fail") {
    return undefined;
  }

  return message;
}

async function routeAuthPost(path: string, body: unknown) {
  const response = await fetch(`${AUTH_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new RouteApiError(path, response.status);
  }

  if (!response.ok) {
    throw new RouteApiError(path, response.status, routeApiMessage(payload));
  }

  const parsed = authTokenSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError(path, response.status);
  }

  return parsed.data.token;
}

export function signUp(input: SignUpValues) {
  return routeAuthPost("/auth/signup", input);
}

export function signIn(input: SignInValues) {
  return routeAuthPost("/auth/signin", input);
}
