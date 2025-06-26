import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { LayoutProvider } from "@/components/layout/layout-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CogniVue",
  description: "Prepare for mock interviews the smart way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthPage = children?.toString().includes("AuthLayout");

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased pattern`}>
        <div className="page-transition">
          {isAuthPage ? children : <LayoutProvider>{children}</LayoutProvider>}
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
