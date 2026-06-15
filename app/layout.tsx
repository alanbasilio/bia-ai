import { Sidebar } from "@/components/layout/sidebar";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bia AI — Gestão de Pedidos",
  description: "Painel de gestão de pedidos e clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-screen overflow-hidden antialiased`}
      suppressHydrationWarning
    >
      <body className="h-screen overflow-hidden flex">
        <Providers>
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden p-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
