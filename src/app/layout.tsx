import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/excavla/sidebar";
import { BottomNav } from "@/components/excavla/bottom-nav";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Excavla — Gestión administrativa y operativa para maquinaria pesada",
  description:
    "Excavla centraliza el flujo de caja, la gestión documental y el estado de la maquinaria de tu empresa en una plataforma simple, pensada para la gerencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-text lg:flex-row">
        <Sidebar className="hidden lg:flex" />
        <div className="flex min-h-full flex-1 flex-col lg:h-screen lg:overflow-y-auto">
          {children}
        </div>
        <BottomNav className="lg:hidden" />
        <Toaster />
      </body>
    </html>
  );
}
