import type { Metadata } from "next";
import { Geist_Mono, Mulish } from "next/font/google";
import "./globals.css";
import { getGlobalSiteName } from "@/lib/sanity/queries";

const siteName = await getGlobalSiteName();

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteName?.toUpperCase()} — UNDP Initiatives`,
  description: "Showcasing initiatives for the UN UNDP programme.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
