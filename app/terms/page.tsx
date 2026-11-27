"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Gavel,
  Gauge,
  Handshake,
  HelpCircle,
  Lock,
  Mail,
  ShieldCheck,
  Verified,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { savePdf } from "@/lib/pdf-utils";

const CORE_CARDS = [
  {
    title: "Kepemilikan Berkas 100% Milik Anda",
    badge: "Hak Paten",
    badgeTone: "bg-[#DCE9FF] text-[#0F172A]",
    description:
      "Anda tetap pemilik sah penuh atas semua konten, teks, gambar, dan hak kekayaan intelektual dari dokumen yang diproses. DocuFlow tidak mengklaim hak cipta apa pun.",
    icon: Verified,
    iconBg: "bg-[#DBE1FF] text-[#00174B]",
  },
  {
    title: "Dilarang Dokumen Ilegal",
    badge: "Wajib",
    badgeTone: "bg-[#FFDAD6] text-[#93000A]",
    description:
      "Larangan keras memproses dokumen berbahaya, virus/malware, arsip curian, pelanggaran privasi pihak ketiga, atau materi yang bertentangan dengan hukum Republik Indonesia.",
    icon: Ban,
    iconBg: "bg-[#FFDADA] text-[#40000C]",
  },
  {
    title: "Layanan Disediakan “As-Is”",
    badge: "Prinsip Layanan",
    badgeTone: "bg-[#E5EEFF] text-slate-600",
    description:
      "Sistem DocuFlow dirancang untuk keandalan maksimal tanpa henti, namun kami tidak menjamin operasi tanpa cela pada perangkat dengan keterbatasan memori atau browser usang.",
    icon: Handshake,
    iconBg: "bg-[#6FFBAE] text-[#002113]",
  },
];

const CLAUSES = [
  {
    num: "01",
    title: "1. Penerimaan Ketentuan",
    body: "Dengan mengakses situs web DocuFlow, antarmuka seluler, atau menggunakan layanan otomatis (seperti alat kompresi PDF, penggabungan berkas, ekstraksi, atau rotasi halaman), Anda secara sadar dan mengikat diri pada seluruh isi ketentuan ini. Apabila Anda tidak menyetujui salah satu klausul, Anda dipersilakan menghentikan penggunaan layanan seketika.",
  },
  {
    num: "02",
    title: "2. Batasan Penggunaan & Kuota",
    body: "Demi menjaga stabilitas dan kecepatan pemrosesan di perangkat Anda, DocuFlow menyarankan maksimal 20 berkas PDF per sesi penggabungan. Seluruh komputasi dilakukan di memori browser sehingga kinerja bergantung pada spesifikasi perangkat Anda.",
    note: "Pemrosesan lokal: Tanpa batas kuota harian dan tanpa antrean server.",
  },
  {
    num: "03",
    title: "3. Tanggung Jawab Konten & Privasi",
    body: "Pengguna bertanggung jawab penuh atas legalitas setiap dokumen yang diolah menggunakan DocuFlow. DocuFlow tidak memantau, memeriksa, atau membaca isi dokumen Anda demi menjaga privasi mutlak.",
  },
  {
    num: "04",
    title: "4. Pemrosesan Lokal & Tanpa Retensi Server",
    body: "Semua berkas asli maupun berkas hasil olahan diproses langsung di memori browser Anda dan tidak pernah diunggah ke server penyimpanan mana pun. Kami sangat menyarankan pengguna untuk selalu menyimpan salinan cadangan berkas asli di perangkat pribadi masing-masing.",
  },
  {
    num: "05",
    title: "5. Batasan Tanggung Jawab (Disclaimer)",
    body: "Sejauh diizinkan oleh peraturan perundang-undangan, DocuFlow, pengembang, dan afiliasinya tidak bertanggung jawab atas kerugian finansial, kehilangan data akibat kegagalan perangkat keras, atau rusaknya file asli yang tidak dicadangkan di sisi pengguna.",
  },
];

export default function TermsPage() {
  const [openClause, setOpenClause] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadedToast, setDownloadedToast] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("legal@docuflow.id");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleDownloadTermsPdf = async () => {
    setDownloading(true);
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595, 842]);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const regular = await doc.embedFont(StandardFonts.Helvetica);

      let y = 780;
      page.drawText("Syarat & Ketentuan Layanan DocuFlow", {
        x: 50,
        y,
        size: 18,
        font: bold,
        color: rgb(0.06, 0.09, 0.16),
      });
      y -= 20;
      page.drawText("Versi 2.4 • Berlaku Efektif: November 2026", {
        x: 50,
        y,
        size: 10,
        font: regular,
        color: rgb(0.39, 0.45, 0.55),
      });
      y -= 32;

      for (const clause of CLAUSES) {
        page.drawText(clause.title, {
          x: 50,
          y,
          size: 12,
          font: bold,
          color: rgb(0.72, 0.11, 0.11),
        });
        y -= 16;

        const words = clause.body.split(" ");
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (regular.widthOfTextAtSize(test, 10) > 495) {
            page.drawText(line, {
              x: 50,
              y,
              size: 10,
              font: regular,
              color: rgb(0.2, 0.25, 0.33),
            });
            y -= 14;
            line = word;
          } else {
            line = test;
          }
        }
        if (line) {
          page.drawText(line, {
            x: 50,
            y,
            size: 10,
            font: regular,
            color: rgb(0.2, 0.25, 0.33),
          });
          y -= 24;
        }
      }

      const bytes = await doc.save();
      savePdf(bytes, "DocuFlow-Syarat-Ketentuan.pdf");
      setDownloadedToast(true);
      window.setTimeout(() => setDownloadedToast(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6 pb-16 sm:px-6 sm:py-8">
      {/* Top Meta Badges & Heading */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE9FF] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#0050D4] uppercase shadow-2xs">
            <ShieldCheck size={13} /> Legal &amp; Kepatuhan Layanan
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-600 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Versi 2.4 • Berlaku Efektif: November 2026
          </span>
        </div>

        <div>
          <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-[28px]">
            Syarat &amp; Ketentuan Layanan DocuFlow
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748B]">
            Panduan hak, tanggung jawab, dan aturan penggunaan layanan pengolahan dokumen, kompresi
            berkas, dan ekstraksi halaman.
          </p>
        </div>

        {/* Quick Status Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="flex items-start gap-3.5 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-extrabold text-[#0F172A]">
                  Status Layanan: Bebas Akses
                </h2>
                <span className="rounded-full bg-[#6FFBAE] px-2.5 py-0.5 text-[10px] font-bold text-[#002113]">
                  Publik &amp; Terbuka
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                DocuFlow beroperasi tanpa biaya langganan tersembunyi, pendaftaran wajib, atau
                pengurangan hak kepemilikan atas berkas yang Anda kompresi atau olah.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#EFF4FF]/70 px-4 py-2.5 text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
              <Clock size={13} className="text-[#B91C1C]" /> Rata-rata Waktu Baca: 4 Menit
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
              <Lock size={12} /> 100% Proses Lokal
            </span>
          </div>
        </div>
      </section>

      {/* Komitmen Transparansi */}
      <section className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] text-[#B91C1C]">
          <ShieldCheck size={28} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
            Komitmen Transparansi
          </p>
          <h3 className="truncate text-sm font-extrabold text-[#0F172A]">
            Standar Pemrosesan Dokumen 2026
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
            Kebijakan adil dan terbuka yang disusun untuk melindungi privasi pengguna saat
            memproses dokumen penting harian.
          </p>
        </div>
      </section>

      {/* Ringkasan Inti Dalam 60 Detik */}
      <section aria-labelledby="ringkasan-inti-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="ringkasan-inti-heading"
              className="text-lg font-extrabold tracking-tight text-[#0F172A]"
            >
              Ringkasan Inti Dalam 60 Detik
            </h2>
            <p className="text-xs text-[#64748B]">
              Prinsip dasar yang perlu Anda pahami sebelum mulai memproses dokumen.
            </p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-50 text-[#B91C1C]">
            <Zap size={16} />
          </span>
        </div>

        <div className="space-y-2.5">
          {CORE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${card.iconBg}`}
                >
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">{card.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${card.badgeTone}`}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Klausul & Tata Tertib Rinci (Accordion) */}
      <section aria-labelledby="klausul-rinci-heading" className="space-y-3">
        <div>
          <h2
            id="klausul-rinci-heading"
            className="text-lg font-extrabold tracking-tight text-[#0F172A]"
          >
            Klausul &amp; Tata Tertib Rinci
          </h2>
          <p className="text-xs text-[#64748B]">
            Klik masing-masing pasal di bawah untuk melihat rincian batasan hukum lengkap.
          </p>
        </div>

        <div className="space-y-2">
          {CLAUSES.map((clause, idx) => {
            const isOpen = openClause === idx;
            return (
              <div
                key={clause.num}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenClause(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#E5EEFF] text-xs font-extrabold text-[#0050D4]">
                      {clause.num}
                    </span>
                    <span className="truncate text-xs font-extrabold text-[#0F172A] sm:text-sm">
                      {clause.title}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#B91C1C]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pt-3 pb-4">
                    <p className="text-xs leading-relaxed text-[#64748B]">{clause.body}</p>
                    {clause.note && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-[#EFF4FF] px-3 py-2 text-[11px] font-semibold text-slate-700">
                        <Gauge size={15} className="shrink-0 text-[#B91C1C]" />
                        <span>{clause.note}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Prosedur Keamanan: Penegakan Aturan & Pelanggaran */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFDADA] text-[#B91C1C]">
            <Gavel size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
              Prosedur Keamanan
            </p>
            <h3 className="mt-0.5 text-sm font-extrabold text-[#0F172A]">
              Penegakan Aturan &amp; Pelanggaran
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">
              Sistem validasi lokal kami memeriksa struktur header berkas sebelum diproses. Apabila
              terdeteksi berkas rusak atau format tidak sah, sistem akan langsung:
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-[#EFF4FF] px-3 py-2 text-xs text-slate-700">
                <XCircle size={16} className="shrink-0 text-[#BA1A1A]" />
                <span>Membatalkan pemrosesan berkas secara instan tanpa menulis ke disk.</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[#EFF4FF] px-3 py-2 text-xs text-slate-700">
                <WifiOff size={16} className="shrink-0 text-[#B91C1C]" />
                <span>Menjaga sesi tetap terisolasi penuh di sandbox memori browser Anda.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Punya Pertanyaan Hukum? */}
      <section className="rounded-2xl bg-[#EFF4FF] p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#0050D4] shadow-2xs">
            <HelpCircle size={20} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">Punya Pertanyaan Hukum?</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
              Hubungi Tim Legal &amp; Kepatuhan Regulasi DocuFlow untuk klarifikasi perizinan atau
              informasi layanan.
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-2xs">
          <span className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
            <Mail size={16} className="text-slate-500" />
            legal@docuflow.id
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#DCE9FF] px-3 py-1.5 text-[11px] font-bold text-[#0050D4] transition-transform active:scale-95"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Tersalin!" : "Salin Email"}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 font-bold text-[#0050D4] hover:underline"
          >
            <ShieldCheck size={15} /> Buka Kebijakan Privasi
          </Link>
          <span className="text-[11px] font-semibold text-slate-500">Respon: &lt; 24 Jam Kerja</span>
        </div>
      </section>

      {/* Acceptance & Download CTAs */}
      <div className="space-y-2.5 pt-1">
        <Link
          href="/"
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#E11D48] px-6 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-colors hover:bg-[#BE123C]"
        >
          <CheckCircle2 size={18} /> Saya Mengerti &amp; Lanjut ke Beranda
        </Link>

        <button
          type="button"
          onClick={handleDownloadTermsPdf}
          disabled={downloading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-[#0F172A] shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          <Download size={16} className="text-[#B91C1C]" />
          {downloading ? "Menyiapkan Dokumen..." : "Unduh Dokumen Syarat (.PDF)"}
        </button>

        {downloadedToast && (
          <div
            role="status"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md"
          >
            <CheckCircle2 size={15} className="text-emerald-400" />
            DocuFlow-Syarat-Ketentuan.pdf berhasil diunduh.
          </div>
        )}
      </div>

      {/* Legal Footer Note */}
      <p className="pt-2 text-center text-[11px] leading-relaxed text-slate-400">
        DocuFlow Legal Center © 2026. Dilindungi hukum dan ketentuan layanan yang berlaku di
        Republik Indonesia.
      </p>
    </main>
  );
}
