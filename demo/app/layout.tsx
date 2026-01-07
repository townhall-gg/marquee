import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marquee Demo | @townhall-gg/marquee",
  description:
    "A blazing-fast, buttery-smooth marquee using Web Animations API. Zero dependencies, accessible, and ready for production.",
  keywords: ["marquee", "react", "animation", "waapi", "web animations api", "townhall"],
  authors: [{ name: "Townhall", url: "https://th.gg" }],
  openGraph: {
    title: "Marquee Demo | @townhall-gg/marquee",
    description: "A blazing-fast, buttery-smooth marquee using Web Animations API.",
    url: "https://marquee.th.gg",
    siteName: "Townhall Marquee",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marquee Demo | @townhall-gg/marquee",
    description: "A blazing-fast, buttery-smooth marquee using Web Animations API.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
