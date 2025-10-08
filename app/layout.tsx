import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthGuard from "./AuthGuard";
import { GlobalLoader } from "@/lib/GlobalLoader";
import { RouteLoadingReset } from "@/components/RouteLoadingReset";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMS",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >

      <head />
      <body>
        <RouteLoadingReset />
        <GlobalLoader />

        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </GlobalProvider>
          <Toaster />
        </ThemeProvider>

      </body>
    </html>
  );
}
