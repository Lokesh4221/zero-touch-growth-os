import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { BusinessProvider } from "@/context/BusinessContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zero-Touch Growth OS",
  description: "AI-powered digital marketing platform for small businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <BusinessProvider>
          {children}
          <Toaster />
        </BusinessProvider>
      </body>
    </html>
  );
}

