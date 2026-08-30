"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getDictionary, type Locale } from "@/lib/i18n";

export function RealtimeRefresh({
  initialLocale = "en",
}: {
  initialLocale?: Locale;
}) {
  const t = getDictionary(initialLocale);
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("booking-screen-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classes" },
        scheduleRefresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        scheduleRefresh,
      )
      .subscribe((status) => {
        setIsSynced(status === "SUBSCRIBED");
      });

    function scheduleRefresh() {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(() => {
        router.refresh();
      }, 350);
    }

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      supabase.removeChannel(channel);
    };
  }, [router]);

  if (!isSynced) {
    return null;
  }

  return (
    <div className="fixed right-3 top-3 z-20 flex h-8 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2 text-xs font-bold text-emerald-800 shadow-sm">
      <Radio className="h-3.5 w-3.5" />
      {t.common.live}
    </div>
  );
}
