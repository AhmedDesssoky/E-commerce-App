import { routing } from "./i18n/routing";
import common from "../messages/en/common.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof common;
    };
  }
}
