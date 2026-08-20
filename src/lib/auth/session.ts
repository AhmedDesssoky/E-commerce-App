import { cookies } from "next/headers";
import { maxAgeFromJwt } from "@/lib/auth/jwt-max-age";

const ROUTE_TOKEN_COOKIE = "route_token";
const DEFAULT_ADDRESS_COOKIE = "default_address_id";

const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getRouteToken() {
  const jar = await cookies();
  return jar.get(ROUTE_TOKEN_COOKIE)?.value || null;
}

export async function setRouteToken(token: string) {
  const jar = await cookies();
  const maxAge = maxAgeFromJwt(token);

  jar.set({
    name: ROUTE_TOKEN_COOKIE,
    value: token,
    ...tokenCookieOptions,
    ...(maxAge === undefined ? {} : { maxAge }),
  });
}

export async function clearRouteToken() {
  const jar = await cookies();
  jar.set({
    name: ROUTE_TOKEN_COOKIE,
    value: "",
    ...tokenCookieOptions,
    maxAge: 0,
  });
}

export async function getDefaultAddressId() {
  const jar = await cookies();
  return jar.get(DEFAULT_ADDRESS_COOKIE)?.value || null;
}

export async function setDefaultAddressId(addressId: string) {
  const jar = await cookies();
  jar.set({
    name: DEFAULT_ADDRESS_COOKIE,
    value: addressId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
