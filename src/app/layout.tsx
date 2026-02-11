import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";

export const metadata: Metadata = {
  title: "RewOz Partner - Payment Portal",
  description: "Secure partner payment and subscription management for RewOz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
