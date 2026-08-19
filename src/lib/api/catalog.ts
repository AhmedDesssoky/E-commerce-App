import { cache } from "react";
import { z } from "zod";
import { routeCatalogGet } from "@/lib/api/client";
import { ROUTE_HOST } from "@/lib/api/origin";
import { isCatalogFailure, logCatalogFailure } from "@/lib/api/route-error";

function isRouteCdnUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === ROUTE_HOST;
  } catch {
    return false;
  }
}

const routeCdnUrlSchema = z.string().refine(isRouteCdnUrl);

export const productIdSchema = z.string().regex(/^[a-f0-9]{24}$/i);

const catalogRefSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  image: routeCdnUrlSchema.optional(),
});

export const categorySchema = catalogRefSchema.extend({
  image: routeCdnUrlSchema,
});

export const brandSchema = catalogRefSchema.extend({
  image: routeCdnUrlSchema,
});

export const productSchema = z.object({
  _id: productIdSchema,
  title: z.string(),
  slug: z.string(),
  imageCover: routeCdnUrlSchema,
  images: z
    .array(z.string())
    .optional()
    .transform((list) => (list ?? []).filter(isRouteCdnUrl)),
  description: z.string().optional(),
  price: z.number(),
  priceAfterDiscount: z.number().optional(),
  quantity: z.number(),
  ratingsAverage: z.number().optional(),
  ratingsQuantity: z.number().optional(),
  brand: catalogRefSchema,
  category: catalogRefSchema,
});

const metadataSchema = z
  .object({
    currentPage: z.number(),
    numberOfPages: z.number(),
    limit: z.number(),
  })
  .loose();

const listEnvelopeSchema = z.object({
  results: z.number().optional(),
  metadata: metadataSchema.optional(),
  data: z.array(z.unknown()),
});

function parseCatalogList<T>(item: z.ZodType<T>, payload: unknown): T[] {
  const envelope = listEnvelopeSchema.parse(payload);
  const items: T[] = [];

  for (const row of envelope.data) {
    const parsed = item.safeParse(row);
    if (parsed.success) {
      items.push(parsed.data);
    }
  }

  return items;
}

export type Category = z.infer<typeof categorySchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Product = z.infer<typeof productSchema>;

export function productDisplayPrice(product: {
  price: number;
  priceAfterDiscount?: number;
}) {
  const discounted = product.priceAfterDiscount;

  if (discounted !== undefined && discounted < product.price) {
    return { onSale: true as const, amount: discounted };
  }

  return { onSale: false as const, amount: product.price };
}

export function relatedProducts(
  items: Product[],
  productId: string,
  limit: number,
) {
  return items.filter((item) => item._id !== productId).slice(0, limit);
}

export async function listProducts(query?: {
  limit?: number;
  page?: number;
  sort?: string;
  category?: string;
}) {
  return parseCatalogList(productSchema, await routeCatalogGet("/products", query));
}

export async function listCategories(query?: { limit?: number; page?: number }) {
  return parseCatalogList(
    categorySchema,
    await routeCatalogGet("/categories", query),
  );
}

export async function listBrands(query?: { limit?: number; page?: number }) {
  return parseCatalogList(brandSchema, await routeCatalogGet("/brands", query));
}

export const getProduct = cache(async (id: string) => {
  const safeId = productIdSchema.parse(id);
  const payload = z
    .object({ data: productSchema })
    .parse(await routeCatalogGet(`/products/${safeId}`));
  return payload.data;
});

export async function loadCatalogSlice<T>(
  label: string,
  loader: () => Promise<T>,
): Promise<T | null> {
  try {
    return await loader();
  } catch (error) {
    if (!isCatalogFailure(error)) {
      throw error;
    }

    logCatalogFailure(label, error);
    return null;
  }
}
