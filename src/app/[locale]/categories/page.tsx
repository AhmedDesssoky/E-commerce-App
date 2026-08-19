import { getTranslations } from "next-intl/server";
import { PageHeading } from "@/components/page-heading";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("categories") };
}

export default function CategoriesPage() {
  return <PageHeading navKey="categories" />;
}
