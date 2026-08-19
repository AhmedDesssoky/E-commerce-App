import { getTranslations } from "next-intl/server";
import { CatalogStatus, ProductDetailSkeleton } from "@/components/skeleton";

export default async function Loading() {
  const t = await getTranslations("common");

  return (
    <CatalogStatus label={t("home.loading")}>
      <ProductDetailSkeleton />
    </CatalogStatus>
  );
}
