import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Comfortaa } from 'next/font/google';
import "./globals.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const comfortaa = Comfortaa({
  subsets: ['vietnamese', 'latin'],
  display: 'swap'
});

const productSans = localFont({
  src: "./fonts/ProductSans-Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
  title: "DevFest Cloud Hanoi 2024 | GDG Cloud Hanoi",
  description: "Event by GDG Cloud Hanoi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html className="scroll-smooth" lang={locale}>
      <body className={`${productSans.className} antialiased`}>
        <AntdRegistry>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`} />
    </html>
  );
}
