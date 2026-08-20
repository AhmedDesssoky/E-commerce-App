import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getRouteToken } from "@/lib/auth/session";

type Locale = (typeof routing.locales)[number];

/**
 * Stripe return path: `${origin}/{locale}/allorders`
 * Revalidates in a Route Handler (not during RSC render), then opens orders.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await context.params;
  const locale = routing.locales.includes(raw as Locale)
    ? (raw as Locale)
    : routing.defaultLocale;

  const token = await getRouteToken();

  if (!token) {
    redirect({
      href: { pathname: "/sign-in", query: { next: "/orders" } },
      locale,
    });
  }

  revalidatePath("/[locale]/cart", "page");
  revalidatePath("/[locale]/checkout", "page");
  revalidatePath("/[locale]/orders", "page");

  redirect({ href: "/orders", locale });
}
