import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "RiceOS - Hệ Thống Cân Lúa Thông Minh",
  description: "Ứng dụng quản lý cân lúa ngoài đồng ruộng hỗ trợ di động, Supabase, Next.js và Vercel",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} bg-brand-dark text-slate-100 antialiased min-h-screen selection:bg-gold-500 selection:text-brand-dark`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <footer className="border-t border-emerald-900/40 bg-brand-dark/80 py-4 text-center text-xs text-slate-500">
              RiceOS © 2026 - System designed for Rice Harvest Weighing & Management
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
