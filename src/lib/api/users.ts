import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const USERS_URL = `${ROUTE_ORIGIN}/api/v1/users`;

const failSchema = z.object({
  message: z.string().optional(),
  statusMsg: z.string().optional(),
});

const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional().default(""),
});

const userResponseSchema = z.object({
  data: userSchema,
});

const passwordResponseSchema = z.object({
  token: z.string().min(1).optional(),
});

export type LoggedUser = z.infer<typeof userSchema>;

export type UpdateUserInput = {
  name: string;
  email: string;
  phone: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  password: string;
  rePassword: string;
};

function routeApiMessage(payload: unknown) {
  const parsed = failSchema.safeParse(payload);
  const message = parsed.success
    ? parsed.data.message?.trim() || parsed.data.statusMsg?.trim()
    : undefined;

  if (!message || message.toLowerCase() === "fail") {
    return undefined;
  }

  return message;
}

async function usersFetch(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(`${USERS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      token,
      ...init?.headers,
    },
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

  return payload;
}

export async function getLoggedUser(token: string): Promise<LoggedUser> {
  const payload = await usersFetch("/getMe", token);
  const parsed = userResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/getMe", 500);
  }

  return parsed.data.data;
}

export async function updateLoggedUser(token: string, input: UpdateUserInput) {
  const payload = await usersFetch("/updateMe", token, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  const parsed = userResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/updateMe", 500);
  }

  return parsed.data.data;
}

export async function changeLoggedUserPassword(
  token: string,
  input: ChangePasswordInput,
) {
  const payload = await usersFetch("/changeMyPassword", token, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  const parsed = passwordResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/changeMyPassword", 500);
  }

  return parsed.data.token ?? null;
}
