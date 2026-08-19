import { notFound } from "@/i18n/navigation";
import {
  getProduct,
  listProducts,
  loadCatalogSlice,
  productIdSchema,
  relatedProducts,
} from "@/lib/api/catalog";
import { ProductDetail } from "@/components/product-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!productIdSchema.safeParse(id).success) {
    return {};
  }

  const product = await loadCatalogSlice("product-meta", () => getProduct(id));

  if (!product) {
    return {};
  }

  const description = product.description?.replace(/\s+/g, " ").slice(0, 160);

  return {
    title: product.title,
    description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!productIdSchema.safeParse(id).success) {
    notFound();
  }

  const product = await loadCatalogSlice("product", () => getProduct(id));

  if (!product) {
    notFound();
  }

  const related = await loadCatalogSlice("related", () =>
    listProducts({ limit: 8, category: product.category._id }),
  );

  return (
    <ProductDetail
      product={product}
      related={related === null ? null : relatedProducts(related, product._id, 4)}
    />
  );
}
