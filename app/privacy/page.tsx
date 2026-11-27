"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  EyeOff,
  Laptop,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const PILLARS = [
  {
    title: "Pemrosesan Lokal (Client-Side)",
    description:
      "Seluruh penggabungan, ekstraksi, rotasi, dan kompresi PDF maupun gambar berjalan langsung di browser Anda tanpa mengirim data ke server.",
    note: "Nol konsumsi bandwidth server",
    noteColor: "text-[#B91C1C]",
    icon: Laptop,
    iconBg: "bg-[#FFE4E6] text-[#B91C1C]",
  },
  {
    title: "Zero Data Retention / Tanpa Intip Berkas",
    description:
      "Kami tidak pernah membuka, membaca, menganalisis, atau menyimpan isi dokumen Anda untuk pelatihan model AI atau pihak ketiga mana pun.",
    note: "Akses eksternal mustahil secara teknis",
    noteColor: "text-[#2563EB]",
    icon: EyeOff,
    iconBg: "bg-[#E0E7FF] text-[#2563EB]",
  },
  {
    title: "Tanpa Cookie Pelacak & Iklan",
    description:
      "Kami tidak menggunakan cookie pelacak pihak ketiga atau alat analitik yang mengidentifikasi profil pengguna secara individu.",
    note: "Bebas pelacak & analitik invasif",
    noteColor: "text-[#059669]",
    icon: ShieldCheck,
    iconBg: "bg-[#DCFCE7] text-[#059669]",
  },
  {
    title: "Kontrol Penuh di Memori Perangkat",
    description:
      "Dokumen hanya berada di RAM browser selama sesi aktif. Saat tab ditutup atau halaman dimuat ulang, seluruh data sementara langsung dilepaskan.",
    note: "Pembersihan memori otomatis",
    noteColor: "text-slate-600",
    icon: Lock,
    iconBg: "bg-[#EFF4FF] text-slate-700",
  },
];

const POLICY_ITEMS = [
  {
    title: "Data Apa Saja yang Kami Kumpulkan?",
    content:
      "DocuFlow tidak mengumpulkan data pribadi, nama, alamat email, alamat IP, ataupun isi dokumen yang Anda proses. Seluruh berkas tetap berada di perangkat Anda.",
  },
  {
    title: "Bagaimana Cara Kerja Pemrosesan PDF & Gambar?",
    content:
      "Browser Anda menjalankan pustaka client-side (pdf-lib, PDF.js, dan Canvas API) secara lokal untuk menggabungkan, mengompres, mengekstrak, dan memutar halaman tanpa unggahan server.",
  },
  {
    title: "Hak Pengguna & Penghapusan Data Sesi",
    content:
      "Karena tidak ada data yang disimpan di server, Anda memegang kendali penuh sejak awal hingga akhir. Menutup tab atau menekan tombol Reset langsung menghapus seluruh berkas dari memori sesi.",
  },
  {
    title: "Penggunaan Cookie & Pelacak Pihak Ketiga",
    content:
      "Kami tidak memasang cookie pelacakan iklan maupun skrip analitik pihak ketiga. Kami hanya berfokus pada keandalan dan kecepatan utilitas dokumen Anda.",
  },
];

export default function PrivacyPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("dpo@docuflow.id");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6 pb-16 sm:px-6 sm:py-8">
      {/* Hero Card */}
      <section className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-[#ECFDF5]/60 p-5 shadow-xs sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#86EFAC]/50 px-3 py-1 text-[10px] font-extrabold text-[#065F46]">
          <CheckCircle2 size={12} /> 100% Client-Side &amp; Privasi Terjamin
        </span>

        <h1 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-[27px]">
          Privasi &amp; Keamanan Dokumen Anda adalah Prioritas Utama Kami
        </h1>

        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Clock size={12} /> Terakhir diperbarui: 27 November 2026
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-3.5 py-2.5 shadow-2xs">
          <span className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Protokol Keamanan Aktif
          </span>
          <span className="rounded-full bg-[#86EFAC]/50 px-2.5 py-0.5 text-[10px] font-extrabold text-[#065F46]">
            Zero-Upload
          </span>
        </div>
      </section>

      {/* 4 Pilar Utama Jaminan Keamanan */}
      <section aria-labelledby="pilar-keamanan-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="pilar-keamanan-heading"
            className="text-[15px] font-extrabold tracking-tight text-[#0F172A]"
          >
            4 Pilar Utama Jaminan Keamanan
          </h2>
          <span className="text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
            100% Transparan
          </span>
        </div>

        <div className="space-y-2.5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${pillar.iconBg}`}
                >
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{pillar.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                    {pillar.description}
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold ${pillar.noteColor}`}
                  >
                    <Zap size={10} /> {pillar.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rincian Kebijakan & Tata Kelola */}
      <section aria-labelledby="rincian-kebijakan-heading" className="space-y-3">
        <div>
          <h2
            id="rincian-kebijakan-heading"
            className="text-[15px] font-extrabold tracking-tight text-[#0F172A]"
          >
            Rincian Kebijakan &amp; Tata Kelola
          </h2>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Ketuk topik di bawah untuk melihat rincian operasional kami.
          </p>
        </div>

        <div className="space-y-2">
          {POLICY_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.title}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#F1F5FF] text-xs font-extrabold text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] sm:text-[13px]">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#B91C1C]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-[#F8FAFF] px-4 py-3 pl-14 text-xs leading-relaxed text-[#64748B]">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Siklus Hidup Berkas di DocuFlow */}
      <section className="rounded-3xl bg-[#EFF4FF] p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#DCFCE7] text-[#059669]">
            <Clock size={16} />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              Siklus Hidup Berkas di DocuFlow
            </h2>
            <p className="text-[11px] text-[#64748B]">Linimasa perlindungan dokumen Anda</p>
          </div>
        </div>

        <div className="mt-3.5 space-y-3.5 rounded-2xl bg-white p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            <div>
              <p className="text-xs font-extrabold text-[#0F172A]">
                Langkah 1: Pilih Berkas Lokal
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                Dokumen dibaca langsung dari perangkat Anda ke memori browser tanpa unggahan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#B91C1C]" />
            <div>
              <p className="text-xs font-extrabold text-[#0F172A]">
                Langkah 2: Pemrosesan Aman
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                Berkas digabung, dikompres, atau diekstrak secara lokal di sandbox browser Anda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-500" />
            <div>
              <p className="text-xs font-extrabold text-[#0F172A]">
                Langkah 3: Unduh &amp; Bersihkan Memori
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                Hasil diunduh ke perangkat Anda dan seluruh data sementara dilepaskan otomatis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Petugas Perlindungan Data (DPO) */}
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFE4E6] text-[#B91C1C]">
            <ShieldAlert size={19} />
          </span>
          <div>
            <p className="text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
              Perlindungan Data Resmi
            </p>
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              Petugas Perlindungan Data (DPO)
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              Punya pertanyaan spesifik tentang kepatuhan privasi atau keamanan DocuFlow?
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F8FAFF] px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
            <Mail size={14} className="text-slate-500" />
            dpo@docuflow.id
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-600" /> Tersalin
              </>
            ) : (
              <>
                <Copy size={12} /> Salin
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <a
            href="mailto:dpo@docuflow.id"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D91B24] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#B8141C]"
          >
            <ShieldCheck size={15} /> Hubungi Tim Keamanan
          </a>
          <Link
            href="/"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#EFF4FF] px-4 text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#E0E7FF]"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </section>

      {/* Bottom Verified Shield */}
      <div className="pt-1 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#065F46] uppercase">
          <Sparkles size={11} /> DocuFlow Security Shield Verified
        </span>
        <p className="mt-1.5 text-[10px] text-slate-400">
          Pemrosesan 100% lokal di browser Anda tanpa unggahan ke server mana pun.
        </p>
      </div>
    </main>
  );
}
