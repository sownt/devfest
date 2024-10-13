import type { Metadata } from "next";
import localFont from "next/font/local";
import { Comfortaa } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const comfortaa = Comfortaa({
  subsets: ['vietnamese', 'latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "DevFest Cloud Hanoi 2024 | GDG Cloud Hanoi",
  description: "Event by GDG Cloud Hanoi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en">
      <body
        className={`${comfortaa.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`} />
    </html>
  );
}
