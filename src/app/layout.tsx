import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { IdleLogout } from "@/components/idle-logout";
import { getSessionContext } from "@/lib/booking-data";
import { getLocale } from "@/lib/i18n-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HappyLife Booking",
  description: "Mobile class booking management for Malaysia time.",
  applicationName: "HappyLife Booking",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HappyLife",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#155e75",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const { user } = await getSessionContext();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-stone-50 text-slate-950">
        <IdleLogout enabled={Boolean(user)} initialLocale={locale} />
        <RealtimeRefresh initialLocale={locale} />
        {children}
        <PwaInstallPrompt initialLocale={locale} />
      </body>
    </html>
  );
}
