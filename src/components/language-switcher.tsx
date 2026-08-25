"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  initialLocale = "en",
  label = "Language",
}: {
  initialLocale?: Locale;
  label?: string;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);

  function chooseLocale(nextLocale: Locale) {
    document.cookie = `hl_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setLocale(nextLocale);
    router.refresh();
  }

  return (
    <div
      aria-label={label}
      className="grid grid-cols-2 rounded-lg border border-stone-300 bg-white p-1"
    >
      <Button
        type="button"
        size="compact"
        variant={locale === "en" ? "default" : "ghost"}
        className="h-8 px-2 text-xs"
        onClick={() => chooseLocale("en")}
      >
        EN
      </Button>
      <Button
        type="button"
        size="compact"
        variant={locale === "ko" ? "default" : "ghost"}
        className="h-8 px-2 text-xs"
        onClick={() => chooseLocale("ko")}
      >
        한글
      </Button>
    </div>
  );
}
