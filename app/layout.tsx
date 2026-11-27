import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NavigationProvider } from "@/components/docuflow/NavigationContext";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "DocuFlow — Utilitas Dokumen Modern",
  description:
    "Gabung, kompres, ekstrak, dan putar halaman PDF serta gambar langsung di browser Anda secara lokal dan privat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-[#F4F6FB] text-[#0F172A] antialiased selection:bg-[#FFE4E6] selection:text-[#B91C1C]">
        <NavigationProvider>
          <Navbar />
          {children}
          <Footer />
        </NavigationProvider>
      </body>
    </html>
  );
}
