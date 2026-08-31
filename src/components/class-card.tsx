"use client";

import Link from "next/link";
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  LogIn,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";

import { cancelBookingAction, requestBookingAction } from "@/app/actions";
import type { BookingRow, ClassWithCounts } from "@/lib/booking-data";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatMalaysiaDateTime } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";

function statusLabel(
  status: ClassWithCounts["effective_status"],
  t: Dictionary,
) {
  if (status === "open") {
    return t.common.open;
  }
  if (status === "upcoming") {
    return t.common.openingSoon;
  }
  return t.common.closed;
}

function bookingStatusLabel(
  status: "pending" | "confirmed" | "cancelled",
  t: Dictionary,
) {
  if (status === "pending") {
    return t.common.pending;
  }
  if (status === "confirmed") {
    return t.common.confirmed;
  }

  return t.common.closed;
}

function StatusPill({
  status,
  t,
}: {
  status: ClassWithCounts["effective_status"];
  t: Dictionary;
}) {
  return <Badge variant={status}>{statusLabel(status, t)}</Badge>;
}

export function ClassCard({
  classItem,
  booking,
  isSignedIn,
  locale,
  t,
}: {
  classItem: ClassWithCounts;
  booking?: BookingRow;
  isSignedIn: boolean;
  locale: Locale;
  t: Dictionary;
}) {
  const remaining = Math.max(classItem.capacity - classItem.confirmed_count, 0);
  const isBookable = classItem.effective_status === "open" && remaining > 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{classItem.title}</CardTitle>
          <CardDescription>{classItem.summary}</CardDescription>
        </div>
        <StatusPill status={classItem.effective_status} t={t} />
      </CardHeader>

      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-cyan-700" />
          <span>{formatMalaysiaDateTime(classItem.starts_at, locale)} MYT</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-700" />
          <span>{classItem.location}</span>
        </div>
      </div>

      <div className="mt-4">
        {booking ? (
          <div
            className={`rounded-lg p-3 text-sm ${
              booking.status === "confirmed"
                ? "bg-emerald-50 text-emerald-900"
                : "bg-amber-50 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-bold">
                {booking.status === "confirmed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                {booking.status === "confirmed"
                  ? t.home.seatConfirmed
                  : t.home.bookingPending}
              </span>
              <Badge>{bookingStatusLabel(booking.status, t)}</Badge>
            </div>
            {booking.status === "pending" ? (
              <p className="mt-2 leading-5">{t.home.transferGuide}</p>
            ) : null}
            <form action={cancelBookingAction} className="mt-3">
              <input type="hidden" name="bookingId" value={booking.id} />
              <SubmitButton
                variant="secondary"
                size="compact"
                className="w-full"
                pendingText={t.home.cancelingBooking}
              >
                <XCircle className="h-4 w-4" />
                {t.home.cancelBooking}
              </SubmitButton>
            </form>
          </div>
        ) : !isSignedIn ? (
          <Button asChild className="w-full">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {t.home.signInToBook}
            </Link>
          </Button>
        ) : (
          <form action={requestBookingAction}>
            <input type="hidden" name="classId" value={classItem.id} />
            <SubmitButton
              disabled={!isBookable}
              pendingText={t.home.applying}
              className="w-full disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Ticket className="h-4 w-4" />
              {isBookable ? t.home.requestBooking : t.home.notAvailable}
            </SubmitButton>
          </form>
        )}
      </div>
    </Card>
  );
}
