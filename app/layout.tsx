import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display, Source_Code_Pro } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthSessionProvider } from "@/providers/sessionProvider";
import { ReactQueryProvider } from "@/providers/queryProvider";
import { Toaster } from "sonner";
import { PWARegister } from "@/components/layout/PWARegister";

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Akbari Savings | Premium Member Portfolio",
  description: "Securely manage and track your savings with the Akbari Savings platform.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Akbari Savings",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased selection:bg-primary/20 selection:text-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NextAuthSessionProvider>
              {children}
              <PWARegister />
              <Toaster position="top-right" richColors closeButton />
            </NextAuthSessionProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}