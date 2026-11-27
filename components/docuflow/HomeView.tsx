"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Combine,
  Download,
  FileText,
  History,
  MoreVertical,
  Plus,
  RotateCw,
  Scissors,
  Search,
  Share2,
  ShieldCheck,
  Shrink,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { formatFileSize } from "@/lib/pdf-utils";
import type { HistoryItem, ViewMode } from "./types";

interface HomeViewProps {
  history: HistoryItem[];
  totalSavedBytes: number;
  onNavigate: (view: ViewMode) => void;
  onQuickFiles: (files: File[]) => void;
}

const TOOL_CARDS = [
  {
    id: "merge" as const,
    targetView: "merge" as ViewMode,
    title: "Gabung PDF",
    description: "Satukan beberapa file PDF jadi satu urutan rapi",
    cta: "Mulai Gabung",
    ctaColor: "text-[#B91C1C]",
    badge: "Populer",
    badgeTone: "border border-red-100 bg-[#FFF1F2] text-[#B91C1C]",
    iconBg: "bg-[#FFE4E6] text-[#B91C1C]",
    icon: Combine,
    keywords: "gabung merge satukan pdf",
  },
  {
    id: "compress" as const,
    targetView: "compress" as ViewMode,
    title: "Kompres Berkas",
    description: "Perkecil ukuran PDF, JPG, PNG tanpa pecah",
    cta: "Optimasi",
    ctaColor: "text-slate-900",
    badge: "Hemat 85%",
    badgeTone: "bg-[#ECFDF5] text-[#059669]",
    iconBg: "bg-[#E2E8F0]/80 text-slate-800",
    icon: Shrink,
    keywords: "kompres compress perkecil pdf jpg png webp gambar foto",
  },
  {
    id: "extract" as const,
    targetView: "extract-rotate" as ViewMode,
    title: "Ekstrak Halaman",
    description: "Ambil atau pisahkan halaman tertentu",
    cta: "Pilih Halaman",
    ctaColor: "text-slate-900",
    badge: null,
    badgeTone: "",
    iconBg: "bg-[#E0E7FF]/80 text-slate-800",
    icon: Scissors,
    keywords: "ekstrak extract pisahkan halaman pdf",
  },
  {
    id: "rotate" as const,
    targetView: "extract-rotate" as ViewMode,
    title: "Putar Halaman",
    description: "Ubah orientasi 90° portrait atau landscape",
    cta: "Atur Arah",
    ctaColor: "text-slate-900",
    badge: null,
    badgeTone: "",
    iconBg: "bg-[#F1ECE6] text-[#57534E]",
    icon: RotateCw,
    keywords: "putar rotate orientasi halaman pdf",
  },
];

export default function HomeView({
  history,
  totalSavedBytes,
  onNavigate,
  onQuickFiles,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) onQuickFiles(accepted);
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 20,
    noClick: true,
  });

  const filteredCards = TOOL_CARDS.filter((card) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return `${card.title} ${card.description} ${card.keywords}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Greeting Header */}
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Selamat Datang! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-[#64748B] sm:max-w-md">
            Pilih alat cepat untuk memproses dokumen atau foto Anda hari ini
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("compress")}
          title="Kompres Cepat"
          className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E8EEFF] text-[#B91C1C] transition-transform hover:scale-105"
        >
          <Zap size={20} className="fill-[#B91C1C]" />
          <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#F8FAFC] bg-emerald-500" />
        </button>
      </section>

      {/* Quick Stats Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-[11px] shadow-xs">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFE4E6] text-[#B91C1C]">
            <CheckCircle2 size={12} />
          </span>
          <strong className="font-bold text-slate-800">
            {history.length} Dokumen Diproses
          </strong>
          <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            Sesi Ini
          </span>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-[11px] shadow-xs">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#E0E7FF] text-slate-700">
            <Cloud size={12} />
          </span>
          <strong className="font-bold text-slate-800">
            {totalSavedBytes > 0 ? formatFileSize(totalSavedBytes) : "0 MB"}
          </strong>
          <span className="text-[10px] font-bold text-emerald-600">Dihemat</span>
        </div>
      </div>

      {/* Search Bar */}
      <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 shadow-xs transition-all focus-within:border-[#B91C1C]/40 focus-within:ring-3 focus-within:ring-red-500/10">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari alat PDF atau format file..."
          aria-label="Cari alat PDF atau format file"
          className="w-full min-w-0 border-0 bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Hapus pencarian"
            className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} />
          </button>
        )}
      </label>

      {/* Alat Utama 2x2 Grid */}
      <section aria-labelledby="alat-utama-heading">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={15} className="text-[#B91C1C]" />
            <h2 id="alat-utama-heading" className="text-[15px] font-extrabold tracking-tight text-[#0F172A]">
              Alat Utama
            </h2>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            4 Pilihan Cepat
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.targetView)}
                className="group relative flex min-h-[168px] flex-col rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md sm:p-4"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${card.iconBg}`}>
                    <Icon size={19} />
                  </span>
                  {card.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold sm:px-2.5 sm:text-[10px] ${card.badgeTone}`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-[14px] font-bold tracking-tight text-[#0F172A]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-snug text-[#64748B]">{card.description}</p>
                </div>

                <div
                  className={`mt-auto flex items-center justify-between pt-3 text-[11px] font-bold ${card.ctaColor}`}
                >
                  <span>{card.cta}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </button>
            );
          })}
          {filteredCards.length === 0 && (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
              Tidak ada alat yang cocok dengan “{searchQuery}”.
            </div>
          )}
        </div>
      </section>

      {/* Dukungan Format Lengkap */}
      <section className="rounded-2xl bg-[#EFF4FF] p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-slate-700" />
            <h2 className="text-xs font-extrabold text-[#0F172A]">Dukungan Format Lengkap</h2>
          </div>
          <span className="text-[10px] font-bold text-[#059669]">100% Native</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#B91C1C] shadow-2xs">
            PDF
          </span>
          {["JPG / JPEG", "PNG", "WEBP"].map((fmt) => (
            <span
              key={fmt}
              className="rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs"
            >
              {fmt}
            </span>
          ))}
        </div>
      </section>

      {/* Seret & Proses Cepat */}
      <div
        {...getRootProps()}
        className={`flex items-center justify-between gap-3 rounded-2xl border bg-white p-3.5 shadow-xs transition-colors ${
          isDragActive
            ? "border-[#B91C1C] bg-red-50/50"
            : "border-slate-100 hover:border-slate-200"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFE4E6] text-[#B91C1C]">
            <UploadCloud size={19} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-[#0F172A]">
              {isDragActive ? "Lepaskan file di sini" : "Seret & Proses Cepat"}
            </p>
            <p className="truncate text-[11px] text-[#64748B]">
              Ketuk untuk pilih dokumen lokal Anda
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={open}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#A8141E] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#8E1019]"
        >
          Pilih <Plus size={14} />
        </button>
      </div>

      {/* Riwayat Terakhir */}
      <section aria-labelledby="riwayat-heading" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <History size={15} className="text-slate-700" />
            <h2 id="riwayat-heading" className="text-sm font-extrabold text-[#0F172A]">
              Riwayat Terakhir
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#B91C1C]">
            {history.length > 0 ? `${history.length} Berkas` : "Sesi Ini"}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-5 text-center text-xs text-slate-500 shadow-xs">
            Belum ada file diproses. Pilih alat di atas untuk memulai.
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 4).map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      idx === 0
                        ? "bg-[#FFE4E6] text-[#B91C1C]"
                        : "bg-[#EFF4FF] text-slate-700"
                    }`}
                  >
                    <FileText size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {item.sizeLabel} •{" "}
                      <span
                        className={`font-bold ${
                          item.actionLabel === "Diekstrak" ? "text-[#B91C1C]" : "text-emerald-600"
                        }`}
                      >
                        {item.actionLabel}
                      </span>{" "}
                      • {item.timestampLabel}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-slate-500">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EFF4FF]">
                    <Download size={14} />
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EFF4FF]">
                    {idx === 0 ? <Share2 size={14} /> : <MoreVertical size={14} />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Privasi Dijamin Aman */}
      <section className="flex items-start gap-3 rounded-2xl bg-[#EFF4FF] p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DCFCE7] text-[#059669]">
          <ShieldCheck size={19} />
        </span>
        <div>
          <h3 className="text-[13px] font-extrabold text-[#0F172A]">Privasi Dijamin Aman</h3>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#64748B]">
            Semua file diproses langsung di browser Anda secara lokal tanpa pernah diunggah ke
            server mana pun.
          </p>
        </div>
      </section>
    </div>
  );
}
