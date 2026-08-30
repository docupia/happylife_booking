import { MALAYSIA_TIME_ZONE } from "./config";
import type { Locale } from "./i18n";

export type ClassStatus = "upcoming" | "open" | "closed";

function intlLocale(locale: Locale = "en") {
  return locale === "ko" ? "ko-KR" : "en-MY";
}

export function formatMalaysiaDateTime(value: string | Date, locale: Locale = "en") {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: MALAYSIA_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function formatMalaysiaDate(value: string | Date, locale: Locale = "en") {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: MALAYSIA_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getEffectiveClassStatus(
  status: ClassStatus,
  startsAt: string,
): ClassStatus {
  if (new Date(startsAt).getTime() <= Date.now()) {
    return "closed";
  }

  return status;
}

export function toMalaysiaIsoFromLocalInput(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return "";
  }

  return `${raw}:00+08:00`;
}

export function toMalaysiaLocalInputValue(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MALAYSIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}
