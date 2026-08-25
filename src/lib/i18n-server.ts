import { cookies } from "next/headers";

import { getDictionary, isLocale, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("hl_locale")?.value;

  return isLocale(locale) ? locale : "en";
}

export async function getI18n() {
  const locale = await getLocale();

  return {
    locale,
    t: getDictionary(locale),
  };
}
