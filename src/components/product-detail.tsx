import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductCardGrid } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { productDisplayPrice, type Product } from "@/lib/api/catalog";

function galleryImages(product: Product) {
  return [...new Set([product.imageCover, ...product.images])];
}

export async function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[] | null;
}) {
  const format = await getFormatter();
  const t = await getTranslations("common");
  const { onSale, amount } = productDisplayPrice(product);
  const outOfStock = product.quantity < 1;
  const money = (value: number) =>
    format.number(value, { style: "currency", currency: "EGP" });
  const rating =
    product.ratingsAverage === undefined
      ? null
      : format.number(product.ratingsAverage, { maximumFractionDigits: 1 });
  const ratingLabel =
    rating === null
      ? null
      : product.ratingsQuantity !== undefined
        ? t("product.ratingWithCount", {
            rating,
            count: format.number(product.ratingsQuantity),
          })
        : t("product.rating", { rating });

  return (
    <div className="mx-auto flex w-full max-w-[var(--token-measure-content)] flex-col px-[var(--token-gutter)] py-12">
      <article className="grid gap-10 md:grid-cols-2 md:items-start">
        <ProductGallery images={galleryImages(product)} title={product.title} />

        <div className="flex max-w-[var(--token-measure-body)] flex-col gap-5 md:sticky md:top-16">
          <p className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
            {product.brand.name}
          </p>
          <h1 className="text-pretty text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
            {product.title}
          </h1>
          <p className="text-[length:var(--token-price-size)] font-semibold leading-[var(--token-price-line)] tabular-nums">
            {onSale ? (
              <>
                <span className="text-sale">{money(amount)}</span>
                <span className="ms-2 text-mute line-through">
                  {money(product.price)}
                </span>
              </>
            ) : (
              <span className="text-ink">{money(amount)}</span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {onSale ? (
              <span className="rounded-full bg-sale px-2.5 py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone">
                {t("product.sale")}
              </span>
            ) : null}
            {outOfStock ? (
              <span className="rounded-full bg-line px-2.5 py-1 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
                {t("product.outOfStock")}
              </span>
            ) : (
              <span className="text-[length:var(--token-label-size)]  font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
                {t("product.inStock")}
              </span>
            )}
            {rating && ratingLabel ? (
              <span
                aria-label={ratingLabel}
                className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute tabular-nums"
              >
                {rating}
                {product.ratingsQuantity !== undefined ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    {format.number(product.ratingsQuantity)}
                  </>
                ) : null}
              </span>
            ) : null}
          </div>
          {product.description ? (
            <p className="max-h-48 overflow-y-auto overscroll-contain whitespace-pre-line text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-ink">
              {product.description}
            </p>
          ) : null}
          <AddToCartForm productId={product._id} disabled={outOfStock} />
          <Link
            href="/products"
            className="text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
          >
            {t("nav.products")}
          </Link>
        </div>
      </article>

      {related === null || related.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-10 text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
            {t("product.related", { category: product.category.name })}
          </h2>
          {related === null ? (
            <p className="max-w-[var(--token-measure-body)] text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
              {t("home.unavailable")}
            </p>
          ) : (
            <ProductCardGrid products={related} />
          )}
        </section>
      ) : null}
    </div>
  );
}
