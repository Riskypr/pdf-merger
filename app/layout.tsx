import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import localFont from "next/font/local";

const googleSansFlex = localFont({
  src: "./fonts/GoogleSansFlex-Latin.woff2",
  weight: "100 1000",
  style: "normal",
  display: "swap",
  variable: "--font-google-sans-flex",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={googleSansFlex.variable}>
      <body className="bg-[#F8FAFC] text-gray-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
