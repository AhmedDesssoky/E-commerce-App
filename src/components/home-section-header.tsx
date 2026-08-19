import { Link } from "@/i18n/navigation";
import { ForwardIcon } from "@/components/nav-icons";
import type { AppPath } from "@/components/site-links";

export function HomeSectionHeader({
  title,
  href,
  viewAll,
}: {
  title: string;
  href: AppPath;
  viewAll: string;
}) {
  return (
    <div className="mb-10 flex items-baseline justify-between gap-4">
      <h2 className="text-[length:var(--token-headline-size)] font-semibold tracking-[var(--token-headline-tracking)] leading-[var(--token-headline-line)] text-ink">
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-[length:var(--token-label-size)] font-medium tracking-[var(--token-label-tracking)] leading-[var(--token-label-line)] text-mute transition-colors duration-[var(--token-duration)] ease-[var(--token-ease)] hover:text-ink"
      >
        {viewAll}
        <ForwardIcon />
      </Link>
    </div>
  );
}
