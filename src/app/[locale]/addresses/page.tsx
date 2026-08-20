import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { AddAddressForm } from "@/components/add-address-form";
import { EditAddressForm } from "@/components/edit-address-form";
import { RemoveAddressButton } from "@/components/remove-address-button";
import { SetDefaultAddressButton } from "@/components/set-default-address-button";
import { getAddresses } from "@/lib/api/addresses";
import { RouteApiError } from "@/lib/api/route-error";
import {
  clearRouteToken,
  getDefaultAddressId,
  getRouteToken,
} from "@/lib/auth/session";

export async function generateMetadata() {
  const t = await getTranslations("common.nav");
  return { title: t("addresses") };
}

export default async function AddressesPage() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const token = await getRouteToken();

  if (!token) {
    redirect({ href: "/sign-in", locale });
    return null;
  }

  let addresses;
  const defaultAddressId = await getDefaultAddressId();

  try {
    addresses = await getAddresses(token);
  } catch (error) {
    if (error instanceof RouteApiError && error.status === 401) {
      await clearRouteToken();
      redirect({ href: "/sign-in", locale });
      return null;
    }

    return (
      <AddressesShell title={t("nav.addresses")}>
        <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
          {t("addresses.unavailable")}
        </p>
      </AddressesShell>
    );
  }

  return (
    <AddressesShell title={t("nav.addresses")}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="rounded-lg border border-line bg-paper p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
              {t("addresses.saved")}
            </h2>
            {addresses.length > 0 ? (
              <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-semibold tabular-nums text-mute">
                {addresses.length}
              </span>
            ) : null}
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-md border border-dashed border-line bg-bone p-6 text-center">
              <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
                {t("addresses.empty")}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {addresses.map((address) => (
                <li
                  key={address._id}
                  className="rounded-md border border-line bg-bone p-4 transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:border-ink/20"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <SetDefaultAddressButton
                      addressId={address._id}
                      isDefault={defaultAddressId === address._id}
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-[length:var(--token-label-size)] font-semibold tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-ink">
                        {address.name}
                      </p>
                      <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
                        {address.details}
                      </p>
                      <p className="text-[length:var(--token-label-size)] leading-[var(--token-label-line)] text-mute">
                        {address.city} · {address.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <RemoveAddressButton addressId={address._id} />
                    </div>
                  </div>
                  <div className="mt-3 border-t border-line pt-3">
                    <EditAddressForm address={address} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-line bg-paper p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="mb-4 text-[length:var(--token-title-size)] font-semibold leading-[var(--token-title-line)] text-ink">
            {t("addresses.addNew")}
          </h2>
          <AddAddressForm />
        </section>
      </div>
    </AddressesShell>
  );
}

function AddressesShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
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
