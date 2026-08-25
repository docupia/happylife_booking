import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HappyLife Class Booking",
    short_name: "HappyLife",
    description: "Mobile class booking management in Malaysia time.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#155e75",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/happylife-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/happylife-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
