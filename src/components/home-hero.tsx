import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ForwardIcon } from "@/components/nav-icons";
import { HomeHeroSlider } from "@/components/home-hero-slider";

export async function HomeHero() {
  const t = await getTranslations("common");

  return (
    <section className="border-b border-line bg-paper">
      <div className="grid md:min-h-[38rem] md:grid-cols-2">
        <div className="flex flex-col justify-center px-[var(--token-gutter)] py-16 md:py-20">
          <div className="flex max-w-[var(--token-measure-body)] flex-col items-start gap-6">
            <h1 className="text-pretty text-[length:var(--token-display-size)] font-semibold tracking-[var(--token-display-tracking)] leading-[var(--token-display-line)] text-ink">
              {t("home.title")}
            </h1>
            <p className="text-[length:var(--token-body-size)] leading-[var(--token-body-line)] text-mute">
              {t("home.intro")}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-sm bg-saffron px-5 py-3 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-bone transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:bg-saffron-deep"
            >
              {t("nav.products")}
              <ForwardIcon />
            </Link>
          </div>
        </div>

        <HomeHeroSlider />
      </div>
    </section>
  );
}
