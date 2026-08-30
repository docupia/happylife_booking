"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getDictionary, type Locale } from "@/lib/i18n";

const IDLE_LIMIT_MS = 2 * 60 * 60 * 1000;
const HAD_SESSION_KEY = "happylife-had-session";
const LAST_ACTIVITY_KEY = "happylife-last-activity";
const ACTIVITY_EVENTS = [
  "click",
  "focus",
  "keydown",
  "pointerdown",
  "scroll",
  "touchstart",
  "visibilitychange",
] as const;

export function IdleLogout({
  enabled,
  initialLocale = "en",
}: {
  enabled: boolean;
  initialLocale?: Locale;
}) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const t = getDictionary(initialLocale);

    function getLastActivity() {
      return Number(
        window.localStorage.getItem(LAST_ACTIVITY_KEY) ?? Date.now(),
      );
    }

    function markActivity() {
      window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    }

    async function redirectToLogin(message: string) {
      await supabase.auth.signOut();
      window.localStorage.removeItem(HAD_SESSION_KEY);
      router.replace(`/login?message=${encodeURIComponent(message)}`);
      router.refresh();
    }

    if (!enabled) {
      const hadSession = window.localStorage.getItem(HAD_SESSION_KEY) === "true";
      if (hadSession && Date.now() - getLastActivity() >= IDLE_LIMIT_MS) {
        void redirectToLogin(t.auth.sessionExpired);
      }
      return;
    }

    window.localStorage.setItem(HAD_SESSION_KEY, "true");

    async function checkSession() {
      const lastActivity = getLastActivity();

      if (Date.now() - lastActivity >= IDLE_LIMIT_MS) {
        await redirectToLogin(t.auth.sessionExpired);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        await redirectToLogin(t.auth.sessionExpired);
      }
    }

    function handleActivity() {
      if (Date.now() - getLastActivity() >= IDLE_LIMIT_MS) {
        void redirectToLogin(t.auth.sessionExpired);
        return;
      }

      markActivity();
    }

    void checkSession();
    if (!window.localStorage.getItem(LAST_ACTIVITY_KEY)) {
      markActivity();
    }
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    const timer = window.setInterval(checkSession, 60 * 1000);
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        window.localStorage.removeItem(HAD_SESSION_KEY);
        router.replace(`/login?message=${encodeURIComponent(t.auth.signedOut)}`);
      }
    });

    return () => {
      window.clearInterval(timer);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      subscription.subscription.unsubscribe();
    };
  }, [enabled, initialLocale, router]);

  return null;
}
