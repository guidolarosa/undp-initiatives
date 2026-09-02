import type { Metadata } from "next";

// Root layout for the embedded Sanity Studio. Kept separate from the localized
// site layout (app/[locale]/layout.tsx) — Studio ships its own styling and must
// not inherit the site's Tailwind globals or fonts.
export const metadata: Metadata = {
  title: "FAROL Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
