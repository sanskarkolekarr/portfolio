import type { Metadata } from "next";
import { Anton, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { portfolioData } from "@/data/portfolio";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sanskar.biz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: portfolioData.identity.fullName,
  description: portfolioData.meta.description,
  openGraph: {
    url: siteUrl,
    title: portfolioData.identity.fullName,
    siteName: portfolioData.identity.fullName,
    description: portfolioData.meta.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioData.identity.fullName,
    description: portfolioData.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-obsidian text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
