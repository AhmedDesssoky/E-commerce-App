import { z } from "zod";
import { ROUTE_ORIGIN } from "@/lib/api/origin";
import { RouteApiError } from "@/lib/api/route-error";

const ADDRESSES_URL = `${ROUTE_ORIGIN}/api/v1/addresses`;

const addressSchema = z.object({
  _id: z.string(),
  name: z.string(),
  details: z.string(),
  phone: z.string(),
  city: z.string(),
});

const addressesResponseSchema = z.object({
  status: z.string(),
  results: z.number().optional(),
  data: z.array(addressSchema),
});

export type Address = z.infer<typeof addressSchema>;

async function addressesFetch(
  url: string,
  token: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      token,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new RouteApiError("/addresses", response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new RouteApiError("/addresses", response.status);
  }
}

export async function getAddresses(token: string): Promise<Address[]> {
  const payload = await addressesFetch(ADDRESSES_URL, token);
  const parsed = addressesResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new RouteApiError("/addresses", 500);
  }

  return parsed.data.data;
}

export async function addAddress(
  token: string,
  input: Pick<Address, "name" | "details" | "phone" | "city">,
) {
  await addressesFetch(ADDRESSES_URL, token, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeAddress(token: string, addressId: string) {
  await addressesFetch(`${ADDRESSES_URL}/${addressId}`, token, {
    method: "DELETE",
  });
}
