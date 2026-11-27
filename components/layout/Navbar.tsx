"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudCheck,
  CopyPlus,
  Files,
  LayoutGrid,
  RefreshCw,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDocuFlowNav } from "@/components/docuflow/NavigationContext";
import type { ViewMode } from "@/components/docuflow/types";

const DESKTOP_TOOLS: {
  id: string;
  targetView: ViewMode;
  title: string;
  badge: string;
  badgeTone: string;
  iconBg: string;
  description: string;
  cta: string;
  icon: typeof ArrowDown;
}[] = [
  {
    id: "compress",
    targetView: "compress",
    title: "Kompres Berkas",
    badge: "Hingga -80%",
    badgeTone: "bg-[#ECFDF5] text-[#059669]",
    iconBg: "bg-[#FFF1F2] text-[#E11D48]",
    description:
      "Kecilkan ukuran file PDF dan gambar (JPG, PNG, WebP) tanpa kehilangan kualitas visual tajam.",
    cta: "Buka Alat Kompres",
    icon: ArrowDown,
  },
  {
    id: "merge",
    targetView: "merge",
    title: "Gabung PDF",
    badge: "Multi-Berkas",
    badgeTone: "bg-[#EFF6FF] text-[#2563EB]",
    iconBg: "bg-[#EFF6FF] text-[#2563EB]",
    description:
      "Satukan puluhan berkas dokumen PDF ke dalam satu urutan teratur secara seret dan lepas.",
    cta: "Buka Alat Gabung",
    icon: Files,
  },
  {
    id: "extract",
    targetView: "extract-rotate",
    title: "Ekstrak PDF",
    badge: "Pisahkan Lembar",
    badgeTone: "bg-[#FEF3C7]/80 text-[#B45309]",
    iconBg: "bg-[#FEF3C7]/70 text-[#D97706]",
    description:
      "Ambil halaman spesifik atau bagi satu dokumen besar menjadi file-file kecil individual.",
    cta: "Buka Alat Ekstrak",
    icon: CopyPlus,
  },
  {
    id: "rotate",
    targetView: "extract-rotate",
    title: "Putar & Orientasi",
    badge: "90° / 180°",
    badgeTone: "bg-[#F3E8FF] text-[#7E22CE]",
    iconBg: "bg-[#F3E8FF] text-[#9333EA]",
    description:
      "Koreksi halaman terbalik atau miring dengan rotasi permanen tanpa merusak font dokumen.",
    cta: "Buka Alat Putar",
    icon: RefreshCw,
  },
];

export default function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { view, previewResult, navigateToView } = useDocuFlowNav();

  const openToolsMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setToolsOpen(true);
  };

  const scheduleCloseToolsMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setToolsOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToolsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleViewSelect = (targetView: ViewMode) => {
    setToolsOpen(false);
    navigateToView(targetView);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const mobileSubtitle =
    pathname === "/about"
      ? "Tentang"
      : pathname === "/privacy"
        ? "Privasi"
        : pathname === "/terms"
          ? "Ketentuan"
          : previewResult
            ? "Pratinjau"
            : view === "merge"
              ? "Gabung PDF"
              : view === "compress"
                ? "Kompres"
                : view === "extract-rotate"
                  ? "Ekstrak & Putar"
                  : "Beranda";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => handleViewSelect("home")}
          className="flex shrink-0 items-center gap-2.5 no-underline"
        >
          <Image
            src="/assets/Logo.png"
            alt="DocuFlow Logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[16px] leading-none tracking-tight text-[#0F172A]">
              <strong className="font-extrabold">DocuFlow</strong>{" "}
              <span className="font-medium text-slate-500 md:hidden">{mobileSubtitle}</span>
            </span>
            <span className="mt-1 hidden text-[11px] font-medium leading-none text-slate-400 md:block">
              Desktop Workstation
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold leading-none text-emerald-600 md:hidden">
              <CloudCheck size={12} />
              Tersinkronisasi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 md:flex" aria-label="Navigasi utama">
          <button
            type="button"
            onClick={() => handleViewSelect("home")}
            className={`text-[13px] font-semibold transition-colors ${
              pathname === "/" && view === "home" && !previewResult
                ? "text-[#E11D48]"
                : "text-slate-700 hover:text-[#0F172A]"
            }`}
          >
            Beranda
          </button>

          <div
            className="relative"
            onMouseEnter={openToolsMenu}
            onMouseLeave={scheduleCloseToolsMenu}
          >
            <button
              type="button"
              onFocus={openToolsMenu}
              aria-expanded={toolsOpen}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-bold transition-all duration-200 ${
                toolsOpen || (pathname === "/" && view !== "home")
                  ? "border-rose-200 bg-[#FFF5F5] text-[#E11D48]"
                  : "border-rose-100 bg-[#FFF8F8] text-[#E11D48] hover:border-rose-200 hover:bg-[#FFF1F2]"
              }`}
            >
              <LayoutGrid size={15} />
              <span>Koleksi Alat Lengkap</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <Link
            href="/about"
            onClick={() => setToolsOpen(false)}
            className={`text-[13px] font-semibold transition-colors ${
              pathname === "/about" ? "text-[#E11D48]" : "text-slate-700 hover:text-[#0F172A]"
            }`}
          >
            Tentang
          </Link>

          <Link
            href="/privacy"
            onClick={() => setToolsOpen(false)}
            className={`text-[13px] font-semibold transition-colors ${
              pathname === "/privacy" ? "text-[#E11D48]" : "text-slate-700 hover:text-[#0F172A]"
            }`}
          >
            Privasi
          </Link>

          <Link
            href="/terms"
            onClick={() => setToolsOpen(false)}
            className={`text-[13px] font-semibold transition-colors ${
              pathname === "/terms" ? "text-[#E11D48]" : "text-slate-700 hover:text-[#0F172A]"
            }`}
          >
            Ketentuan
          </Link>
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <Link
            href="/privacy"
            onClick={() => setToolsOpen(false)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-[#ECFDF5] px-3 py-2 text-xs font-bold text-[#059669] transition-colors hover:bg-emerald-100/70"
          >
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            Semua Layanan Aktif
          </Link>
          <button
            type="button"
            onClick={() => handleViewSelect("merge")}
            className="rounded-xl bg-[#E11D48] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-600/20 transition-colors hover:bg-[#BE123C]"
          >
            Mulai Olah Dokumen
          </button>
        </div>

        {/* Mobile Right Icons (No Hamburger) */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link
            href="/privacy"
            title="Status Privasi Lokal"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <Bell size={18} />
          </Link>
          <Link
            href="/about"
            aria-label="Tentang DocuFlow"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-[#EFF4FF] text-slate-700 shadow-2xs transition-colors hover:bg-[#E0E7FF]"
          >
            <User size={16} />
          </Link>
        </div>
      </div>

      {/* Desktop Mega-Menu Dropdown (Hover) */}
      {toolsOpen && (
        <div
          onMouseEnter={openToolsMenu}
          onMouseLeave={scheduleCloseToolsMenu}
          className="animate-dropdown-enter hidden border-t border-slate-100 bg-white shadow-xl md:block"
        >
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="grid grid-cols-4 gap-4">
              {DESKTOP_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleViewSelect(tool.targetView)}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${tool.iconBg}`}
                    >
                      <Icon size={18} />
                    </span>

                    <div className="mt-3.5 flex items-center justify-between gap-2">
                      <h3 className="text-[14px] font-extrabold text-[#0F172A]">{tool.title}</h3>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${tool.badgeTone}`}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#64748B]">
                      {tool.description}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[11px] font-bold text-[#E11D48] group-hover:underline">
                      {tool.cta} <ChevronRight size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px]">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <CheckCircle2 size={14} className="text-[#10B981]" />
                  Pemrosesan lokal 100% Client-Side
                </span>
                <span>•</span>
                <span>Berkas tidak pernah dikirim ke server</span>
              </div>
              <Link
                href="/about"
                onClick={() => setToolsOpen(false)}
                className="inline-flex items-center gap-1 font-bold text-[#E11D48] hover:underline"
              >
                Pelajari Arsitektur &amp; Keamanan <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
