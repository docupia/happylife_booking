import { MALAYSIA_TIME_ZONE } from "./config";

export type ClassStatus = "upcoming" | "open" | "closed";

const dateTimeFormatter = new Intl.DateTimeFormat("en-MY", {
  timeZone: MALAYSIA_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  timeZone: MALAYSIA_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatMalaysiaDateTime(value: string | Date) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatMalaysiaDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
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

export function defaultVoucherExpiryDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: MALAYSIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );
  const malaysiaDate = new Date(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
  );

  malaysiaDate.setMonth(malaysiaDate.getMonth() + 1);

  return malaysiaDate.toISOString().slice(0, 10);
}
