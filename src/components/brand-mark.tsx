import Image from "next/image";
import { Link } from "@/i18n/navigation";

const LOGO_SRC = "/brand/Vimeo-logo.png";
const LOGO_PX = 32;

export function BrandMark({
  alt,
  preload = false,
}: {
  alt: string;
  preload?: boolean;
}) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <Image
        src={LOGO_SRC}
        alt={alt}
        width={LOGO_PX}
        height={LOGO_PX}
        className="size-8"
        preload={preload}
      />
    </Link>
  );
}
