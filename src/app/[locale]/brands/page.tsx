import { getTranslations } from "next-intl/server";
import { PageHeading } from "@/components/page-heading";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("brands") };
}

export default function BrandsPage() {
  return <PageHeading navKey="brands" />;
}
