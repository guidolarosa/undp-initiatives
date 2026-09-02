import type { NextConfig } from "next";

import { defaultLocale, locales } from "./lib/i18n";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      // Bare site root -> default locale home.
      { source: "/", destination: `/${defaultLocale}/home`, permanent: false },
      // Bare locale root -> that locale's home page.
      ...locales.map((locale) => ({
        source: `/${locale}`,
        destination: `/${locale}/home`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
