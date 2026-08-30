"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "happylife-install-dismissed";

export function PwaInstallPrompt({
  initialLocale = "en",
}: {
  initialLocale?: Locale;
}) {
  const t = getDictionary(initialLocale);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (window.localStorage.getItem(DISMISSED_KEY) === "true") {
        return;
      }

      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  if (!isVisible || !installEvent) {
    return null;
  }

  async function installApp() {
    if (!installEvent) {
      return;
    }

    setIsInstalling(true);
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setIsInstalling(false);

    if (choice.outcome === "accepted") {
      setIsVisible(false);
      setInstallEvent(null);
    }
  }

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setIsVisible(false);
  }

  return (
    <div className="fixed inset-x-3 bottom-20 z-20 mx-auto max-w-md rounded-lg border border-cyan-200 bg-white p-3 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-800 text-white">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{t.pwa.installTitle}</p>
          <p className="mt-0.5 text-sm leading-5 text-slate-600">
            {t.pwa.addHome}
          </p>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <Button
              type="button"
              size="compact"
              disabled={isInstalling}
              onClick={installApp}
            >
              {isInstalling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isInstalling ? t.pwa.installing : t.pwa.install}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isInstalling}
              onClick={dismiss}
              aria-label={t.pwa.dismissInstall}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
