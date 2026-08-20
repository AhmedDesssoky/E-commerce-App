import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("common.checkout");
  return { title: t("successTitle") };
}

export default async function CheckoutSuccessPage() {
  const t = await getTranslations("common.checkout");

  return (
    <div className="mx-auto flex w-full max-w-[var(--token-measure-checkout)] flex-col gap-6 px-[var(--token-gutter)] py-16 text-center">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {t("successTitle")}
      </h1>
      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
        {t("successBody")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
        >
          {t("viewOrders")}
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-sm border border-line px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-line"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
