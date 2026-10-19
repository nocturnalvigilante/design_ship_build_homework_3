import type { MetadataRoute } from "next";

// "Add to Home Screen" opens Last Cup full-screen in the night palette, like an app,
// which is how a nurse would reach it mid-shift. Still no service worker, no backend.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Last Cup",
    short_name: "Last Cup",
    description:
      "See how much caffeine will still be in you when you next sleep, whatever time of day that is.",
    start_url: "/",
    display: "standalone",
    background_color: "#14110f",
    theme_color: "#14110f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
