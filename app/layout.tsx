import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ito",
  description:
    "A mobile-first presence app for private relationship threads and gentle pulses.",
  applicationName: "Ito",
  appleWebApp: {
    capable: true,
    title: "Ito",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf8f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fraunces.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="app-viewport antialiased">{children}</body>
    </html>
  );
}
