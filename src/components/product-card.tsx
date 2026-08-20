import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { AddToWishlistButton } from "@/components/wishlist-button";
import { productDisplayPrice, type Product } from "@/lib/api/catalog";
import { getWishlist } from "@/lib/api/wishlist";
import { getRouteToken } from "@/lib/auth/session";
import { RouteApiError } from "@/lib/api/route-error";

export type ProductCardContent = {
  id: string;
  title: string;
  brand: string;
  imageCover: string;
  price: string;
  originalPrice?: string;
  outOfStockLabel?: string;
  saleLabel?: string;
  inStock: boolean;
  inWishlist: boolean;
};

export function ProductCard({ product }: { product: ProductCardContent }) {
  return (
    <article className="group/card flex flex-col">
      <div className="relative">
        <Link
          href={{ pathname: "/products/[id]", params: { id: product.id } }}
          className="block"
        >
          <div className="relative aspect-[var(--token-ratio-product)] overflow-hidden rounded-lg border border-line bg-paper transition-shadow duration-[var(--token-duration)] ease-[var(--token-ease)] group-hover/card:shadow-md">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[var(--token-duration)] ease-[var(--token-ease)] group-hover/card:scale-[var(--token-scale-image-hover)] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          </div>
        </Link>

        {product.saleLabel && !product.outOfStockLabel ? (
          <span className="absolute start-2 top-2 rounded-full bg-sale px-2.5 py-0.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone">
            {product.saleLabel}
          </span>
        ) : null}

        {product.outOfStockLabel ? (
          <span className="absolute start-2 top-2 rounded-full bg-line px-2.5 py-0.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
            {product.outOfStockLabel}
          </span>
        ) : null}

        <div className="absolute end-2 top-2">
          <AddToWishlistButton
            productId={product.id}
            added={product.inWishlist}
          />
        </div>

        <div className="absolute end-2 bottom-2 translate-y-2 opacity-0 transition-all duration-[var(--token-duration)] ease-[var(--token-ease)] group-hover/card:translate-y-0 group-hover/card:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <AddToCartForm
            productId={product.id}
            disabled={!product.inStock}
            variant="icon"
          />
        </div>
      </div>

      <Link
        href={{ pathname: "/products/[id]", params: { id: product.id } }}
        className="flex flex-col gap-1 pt-3"
      >
        <p className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-[length:var(--token-title-size)] font-medium leading-[var(--token-title-line)] text-ink">
          {product.title}
        </h3>
        <p className="mt-1 text-[length:var(--token-price-size)] font-semibold leading-[var(--token-price-line)] tabular-nums">
          {product.originalPrice ? (
            <>
              <span className="text-sale">{product.price}</span>
              <span className="ms-2 text-[length:var(--token-label-size)] font-normal text-mute line-through">
                {product.originalPrice}
              </span>
            </>
          ) : (
            <span className="text-ink">{product.price}</span>
          )}
        </p>
      </Link>
    </article>
  );
}

export async function ProductCardGrid({ products }: { products: Product[] }) {
  const format = await getFormatter();
  const t = await getTranslations("common.product");
  const token = await getRouteToken();
  let wishlistIds = new Set<string>();

  if (token) {
    try {
      const wishlist = await getWishlist(token);
      wishlistIds = new Set(wishlist.map((item) => item._id));
    } catch (error) {
      if (!(error instanceof RouteApiError)) {
        throw error;
      }
    }
  }

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
                saleLabel: onSale ? t("sale") : undefined,
                inStock: product.quantity > 0,
                inWishlist: wishlistIds.has(product._id),
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
