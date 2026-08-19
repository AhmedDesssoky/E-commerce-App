import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { productDisplayPrice, type Product } from "@/lib/api/catalog";

export type ProductCardContent = {
  id: string;
  title: string;
  brand: string;
  imageCover: string;
  price: string;
  originalPrice?: string;
  outOfStockLabel?: string;
};

export function ProductCard({ product }: { product: ProductCardContent }) {
  return (
    <article>
      <Link
        href={{ pathname: "/products/[id]", params: { id: product.id } }}
        className="group block"
      >
        <div className="relative aspect-[var(--token-ratio-product)] overflow-hidden rounded-md border border-line bg-paper">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-[var(--token-duration)] ease-[var(--token-ease)] group-hover:scale-[var(--token-scale-image-hover)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {product.outOfStockLabel ? (
            <span className="absolute end-2 top-2 rounded-full bg-line px-2.5 py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
              {product.outOfStockLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 pt-3">
          <p className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
            {product.brand}
          </p>
          <h3 className="line-clamp-2 text-[length:var(--token-title-size)] font-medium leading-[var(--token-title-line)] text-ink group-hover:text-ink">
            {product.title}
          </h3>
          <p className="mt-1 text-[length:var(--token-price-size)] font-semibold leading-[var(--token-price-line)] tabular-nums">
            {product.originalPrice ? (
              <>
                <span className="text-sale">{product.price}</span>
                <span className="ms-2 text-mute line-through">
                  {product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-ink">{product.price}</span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}

export async function ProductCardGrid({ products }: { products: Product[] }) {
  const format = await getFormatter();
  const t = await getTranslations("common.product");

  function money(value: number) {
    return format.number(value, { style: "currency", currency: "EGP" });
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const { onSale, amount } = productDisplayPrice(product);

        return (
          <li key={product._id}>
            <ProductCard
              product={{
                id: product._id,
                title: product.title,
                brand: product.brand.name,
                imageCover: product.imageCover,
                price: money(amount),
                originalPrice: onSale ? money(product.price) : undefined,
                outOfStockLabel:
                  product.quantity < 1 ? t("outOfStock") : undefined,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
