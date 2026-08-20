import Image from "next/image";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { getUserOrders } from "@/lib/api/orders";
import { getLoggedUser } from "@/lib/api/users";
import { RouteApiError } from "@/lib/api/route-error";
import { clearRouteToken, getRouteToken } from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("orders") };
}

export default async function OrdersPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({
      href: { pathname: "/sign-in", query: { next: "/orders" } },
      locale,
    });
    return null;
  }

  let orders;

  try {
    const user = await getLoggedUser(token);
    orders = await getUserOrders(token, user._id);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({
        href: { pathname: "/sign-in", query: { next: "/orders" } },
        locale,
      });
      return null;
    }

    return (
      <OrdersShell title={t("nav.orders")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("orders.unavailable")}
        </p>
      </OrdersShell>
    );
  }

  if (orders.length === 0) {
    return (
      <OrdersShell title={t("nav.orders")}>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
            {t("orders.empty")}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
          >
            {t("orders.emptyAction")}
          </Link>
        </div>
      </OrdersShell>
    );
  }

  const format = await getFormatter();

  function money(value: number) {
    return format.number(value, { style: "currency", currency: "EGP" });
  }

  function dateLabel(value?: string) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return format.dateTime(date, { dateStyle: "medium", timeStyle: "short" });
  }

  return (
    <OrdersShell title={t("nav.orders")}>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => {
          const created = dateLabel(order.createdAt);
          const paymentKey =
            order.paymentMethodType === "card" ? "online" : "cash";

          return (
            <li
              key={order._id}
              className="rounded-lg border border-line bg-paper p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[length:var(--token-label-size)] font-semibold tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
                    {t("orders.orderId", { id: order._id.slice(-8) })}
                  </p>
                  {created ? (
                    <p className="mt-1 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
                      {created}
                    </p>
                  ) : null}
                </div>
                <p className="text-[length:var(--token-price-size)] font-semibold tabular-nums text-ink">
                  {money(order.totalOrderPrice)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-line px-2.5 py-0.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
                  {t(`orders.payment.${paymentKey}`)}
                </span>
                <span className="rounded-full bg-line px-2.5 py-0.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
                  {order.isPaid ? t("orders.paid") : t("orders.unpaid")}
                </span>
                <span className="rounded-full bg-line px-2.5 py-0.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute">
                  {order.isDelivered
                    ? t("orders.delivered")
                    : t("orders.pending")}
                </span>
              </div>

              {order.shippingAddress ? (
                <p className="mt-3 text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
                  <span className="font-medium text-ink">
                    {t("orders.shippingAddress")}:{" "}
                  </span>
                  {order.shippingAddress.details}, {order.shippingAddress.city} ·{" "}
                  {order.shippingAddress.phone}
                </p>
              ) : null}

              {order.cartItems.length > 0 ? (
                <ul className="mt-4 divide-y divide-line border-t border-line">
                  {order.cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center gap-3 py-3"
                    >
                      {item.imageCover ? (
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-line bg-bone">
                          <Image
                            src={item.imageCover}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[length:var(--token-label-size)] font-medium leading-[var(--token-label-line)] text-ink">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute tabular-nums">
                          × {item.count} · {money(item.price * item.count)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </OrdersShell>
  );
}

function OrdersShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--token-measure-content)] px-[var(--token-gutter)] py-12">
      <h1 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {title}
      </h1>
      <div className="mt-10">{children}</div>
    </div>
  );
}
