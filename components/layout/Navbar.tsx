"use client";

import { useState } from "react";
import { Combine, FileText, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="PDFCraft beranda">
          <span className="brand-mark"><FileText size={19} /></span>
          <span>PDF<span className="brand-accent">Craft</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          <Link className="nav-current" href="/"><Combine size={15} /> Alat PDF</Link>
          <a href="/about">Tentang</a>
          <a href="/privacy">Privasi</a>
        </nav>
        <a className="nav-privacy" href="/privacy">100% di perangkatmu <span>↗</span></a>
        <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Navigasi mobile">
        <Link href="/" onClick={() => setMenuOpen(false)}><Combine size={16} /> Alat PDF</Link>
        <a href="/about" onClick={() => setMenuOpen(false)}>Tentang</a>
        <a href="/privacy" onClick={() => setMenuOpen(false)}>Privasi</a>
      </nav>}
      <style jsx>{`
        .topbar { position: sticky; top: 0; z-index: 40; width: 100%; border-bottom: 1px solid #e8ede9; background: rgba(255,255,255,.92); backdrop-filter: blur(14px); }
        .topbar-inner { width: min(100% - 36px, 1080px); height: 64px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .brand { display: inline-flex; align-items: center; gap: 9px; color: #24352d; font-size: 16px; font-weight: 750; letter-spacing: -.04em; text-decoration: none; }
        .brand-mark { width: 33px; height: 33px; display: grid; place-items: center; border-radius: 10px; color: #fff; background: #147d5b; }
        .brand-accent { color: #18845e; }
        .desktop-nav { display: flex; align-items: center; gap: 27px; margin-left: 70px; }
        .desktop-nav a { display: inline-flex; align-items: center; gap: 6px; color: #79867f; font-size: 11px; font-weight: 600; text-decoration: none; }
        .desktop-nav a:hover, .desktop-nav .nav-current { color: #147d5b; }
        .nav-privacy { display: inline-flex; align-items: center; gap: 5px; color: #74877b; font-size: 10px; text-decoration: none; }
        .nav-privacy span { color: #24805b; }
        .mobile-menu-button, .mobile-nav { display: none; }
        @media (max-width: 600px) {
          .topbar-inner { width: calc(100% - 28px); height: 56px; }
          .desktop-nav, .nav-privacy { display: none; }
          .mobile-menu-button { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid #e5ebe7; border-radius: 9px; color: #52635a; background: #fff; }
          .mobile-nav { display: flex; flex-direction: column; gap: 2px; padding: 5px 14px 12px; border-top: 1px solid #f0f3f1; background: #fff; }
          .mobile-nav a { display: flex; align-items: center; gap: 8px; padding: 10px 7px; color: #55665c; font-size: 12px; font-weight: 600; text-decoration: none; }
        }
      `}</style>
    </header>
  );
}
