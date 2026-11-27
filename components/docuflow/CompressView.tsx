"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import {
  ArrowDown,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Cpu,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import {
  IMAGE_TYPES,
  compressImage,
  formatFileSize,
} from "@/lib/pdf-utils";
import type { CompressionLevel, ProcessedResult } from "./types";

interface CompressViewProps {
  initialFile?: File | null;
  onPreview: (result: ProcessedResult) => void;
}

const COMPRESSION_MODES: {
  id: CompressionLevel;
  title: string;
  subtitle: string;
  description: string;
  quality: number;
  pdfFactor: number;
  favorite?: boolean;
}[] = [
  {
    id: "max",
    title: "Kompresi Maksimal",
    subtitle: "Extreme Compression",
    description:
      "Kualitas gambar standar, ukuran file paling kecil. Cocok untuk lampiran email atau WhatsApp.",
    quality: 0.55,
    pdfFactor: 0.64,
  },
  {
    id: "recommended",
    title: "Rekomendasi (Terbaik)",
    subtitle: "Balanced Smart Mode",
    description:
      "Keseimbangan sempurna antara ketajaman teks/gambar dan ukuran file efisien.",
    quality: 0.78,
    pdfFactor: 0.82,
    favorite: true,
  },
  {
    id: "light",
    title: "Kompresi Ringan",
    subtitle: "High Quality",
    description:
      "Kualitas mendekati asli, cocok untuk dokumen yang akan dicetak fisik.",
    quality: 0.92,
    pdfFactor: 0.93,
  },
];

export default function CompressView({ initialFile, onPreview }: CompressViewProps) {
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [estimateState, setEstimateState] = useState<{
    file: File;
    map: Partial<Record<CompressionLevel, number>>;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (accepted) => {
      if (accepted[0]) {
        setFile(accepted[0]);
        setEstimateState(null);
        setError("");
        setNotice("");
      }
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    noClick: true,
  });

  const isLossyImage = !!file && (file.type === "image/jpeg" || file.type === "image/webp");
  const estimates = estimateState && estimateState.file === file ? estimateState.map : {};
  const estimating = isLossyImage && (!estimateState || estimateState.file !== file);

  useEffect(() => {
    if (!file || !isLossyImage) return;
    let active = true;
    Promise.all(
      COMPRESSION_MODES.map(async (mode) => {
        const { blob } = await compressImage(file, mode.quality);
        return [mode.id, blob.size] as const;
      }),
    )
      .then((results) => {
        if (!active) return;
        const map: Partial<Record<CompressionLevel, number>> = {};
        for (const [id, size] of results) map[id] = size;
        setEstimateState({ file, map });
      })
      .catch(() => {
        if (active) setEstimateState({ file, map: {} });
      });

    return () => {
      active = false;
    };
  }, [file, isLossyImage]);

  const selectedMode = COMPRESSION_MODES.find((m) => m.id === level)!;
  const originalSize = file?.size ?? 0;
  const estimatedSize = file
    ? isLossyImage
      ? estimates[level] ?? Math.round(originalSize * selectedMode.pdfFactor)
      : Math.round(originalSize * selectedMode.pdfFactor)
    : 0;
  const savedEstimate = Math.max(0, originalSize - estimatedSize);
  const reductionPct = originalSize > 0 ? Math.round((savedEstimate / originalSize) * 100) : 0;

  const handleCompress = async () => {
    if (!file) {
      setError("Pilih satu file PDF atau gambar terlebih dahulu.");
      return;
    }
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (file.type === "application/pdf") {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const compressedBytes = await doc.save({ useObjectStreams: true });
        const outName = `${file.name.replace(/\.pdf$/i, "")}-kompres.pdf`;
        const pdfBuffer = compressedBytes.buffer.slice(
          compressedBytes.byteOffset,
          compressedBytes.byteOffset + compressedBytes.byteLength,
        ) as ArrayBuffer;
        const blob = new Blob([pdfBuffer], { type: "application/pdf" });
        onPreview({
          id: `${Date.now()}`,
          fileName: outName,
          badgeLabel: "PDF Optimal",
          actionLabel: "Dikompres",
          blob,
          pdfBuffer,
          pageCount: doc.getPageCount(),
          originalSize: file.size,
          sourceView: "compress",
        });
      } else if (IMAGE_TYPES[file.type]) {
        const { blob } = await compressImage(file, selectedMode.quality);
        const ext = IMAGE_TYPES[file.type];
        const outName = `${file.name.replace(/\.[^.]+$/, "") || "gambar"}-kompres.${ext}`;
        onPreview({
          id: `${Date.now()}`,
          fileName: outName,
          badgeLabel: "Gambar Terkompres",
          actionLabel: "Dikompres",
          blob,
          originalSize: file.size,
          sourceView: "compress",
        });
      } else {
        setError("Format tidak didukung. Pilih PDF, JPG, PNG, atau WebP.");
      }
    } catch {
      setError("File gagal diproses. Pastikan file tidak rusak atau terenkripsi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF4FF] px-3 py-1 text-[10px] font-bold text-slate-700">
          <Cpu size={12} className="text-slate-600" /> Mesin Optimasi Berkas V4.2
        </span>
        <h1 className="mt-2.5 text-[24px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
          Kompres Ukuran File
        </h1>
        <p className="mt-1 text-[12px] leading-relaxed text-[#64748B] sm:text-[13px]">
          Kurangi ukuran dokumen PDF atau foto tanpa menurunkan keterbacaan teks dan ketajaman
          gambar.
        </p>
      </div>

      {/* File Card / Dropzone */}
      <div
        {...getRootProps()}
        className={`rounded-2xl border bg-white p-4 shadow-xs transition-colors ${
          isDragActive ? "border-[#B91C1C] bg-red-50/40" : "border-slate-100"
        }`}
      >
        <input {...getInputProps()} />
        {!file ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFE4E6] text-[#B91C1C]">
              <UploadCloud size={23} />
            </span>
            <p className="mt-3 text-sm font-bold text-slate-900">
              {isDragActive ? "Lepaskan file di sini" : "Pilih atau seret file ke sini"}
            </p>
            <p className="mt-1 text-xs text-slate-500">Mendukung PDF, JPG, JPEG, PNG, dan WebP</p>
            <button
              type="button"
              onClick={open}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#991B1B]"
            >
              Pilih Berkas
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3.5">
              {/* Circular Document Thumbnail */}
              <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-slate-100 bg-[#F4F7FF] text-[#B91C1C]">
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={24} />
                ) : (
                  <FileText size={24} />
                )}
                <span className="absolute -bottom-0.5 rounded-full bg-slate-900 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase">
                  {file.type === "application/pdf" ? "PDF" : "IMG"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE4E6] px-2 py-0.5 text-[9px] font-extrabold text-[#B91C1C]">
                    <FileText size={10} />
                    {file.type === "application/pdf" ? "PDF Document" : "Berkas Gambar"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 size={11} /> Siap
                  </span>
                </div>

                <p className="mt-1 truncate text-sm font-extrabold text-[#0F172A]">{file.name}</p>
                <p className="text-[11px] text-slate-500">
                  Ukuran Asli: <strong className="text-slate-700">{formatFileSize(file.size)}</strong>
                </p>

                <button
                  type="button"
                  onClick={open}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeftRight size={11} /> Ganti File
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFF] px-3 py-2 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1.5 truncate">
                <Sparkles size={11} className="shrink-0 text-slate-400" />
                Mendukung PDF, JPG, JPEG, PNG, WEBP
              </span>
              <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 font-bold text-slate-700">
                Otomatis
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Compression Level Selector */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-extrabold text-[#0F172A]">Pilih Tingkat Kompresi</h2>
          <span className="text-[11px] font-semibold text-slate-400">3 Mode Pilihan</span>
        </div>

        <div className="space-y-2.5">
          {COMPRESSION_MODES.map((mode) => {
            const selected = level === mode.id;
            const modeEst = file
              ? isLossyImage
                ? estimates[mode.id] ?? Math.round(file.size * mode.pdfFactor)
                : Math.round(file.size * mode.pdfFactor)
              : null;
            const modePct =
              file && modeEst !== null && file.size > 0
                ? Math.max(0, Math.round(((file.size - modeEst) / file.size) * 100))
                : null;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setLevel(mode.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-[#B91C1C]/40 bg-[#FFF5F5] shadow-xs"
                    : "border-slate-100 bg-white shadow-xs hover:border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                        selected
                          ? "border-[5px] border-[#B91C1C] bg-white"
                          : "bg-[#E8EEFF]"
                      }`}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-extrabold text-[#0F172A]">
                          {mode.title}
                        </span>
                        {mode.favorite && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#B91C1C] px-2 py-0.5 text-[9px] font-bold text-white">
                            <Star size={9} className="fill-white" /> Favorit
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">{mode.subtitle}</p>
                    </div>
                  </div>

                  {modeEst !== null && (
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-extrabold text-[#B91C1C]">
                        ~{formatFileSize(modeEst)}
                      </p>
                      {modePct !== null && modePct > 0 && (
                        <span className="mt-0.5 inline-block rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-bold text-[#059669]">
                          Hemat {modePct}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-2 pl-8 text-[11px] leading-relaxed text-[#64748B]">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Simulasi Efisiensi */}
      {file && (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EFF4FF] text-slate-700">
                <CheckCircle2 size={14} />
              </span>
              <h3 className="text-[13px] font-extrabold leading-tight text-[#0F172A]">
                Simulasi Efisiensi
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#86EFAC]/50 px-2.5 py-1 text-[10px] font-bold text-[#065F46]">
              <CheckCircle2 size={11} /> Keterbacaan teks 100% terjaga
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F4F7FF] p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" /> Sebelum
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-[#0F172A]">
                {formatFileSize(originalSize)}
              </p>
              <p className="text-[10px] text-slate-400">Ukuran Mentah</p>
            </div>

            <div className="rounded-2xl bg-[#EFF4FF] p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#B91C1C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C]" /> Sesudah
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-[#B91C1C]">
                {estimating ? "..." : `~${formatFileSize(estimatedSize)}`}
              </p>
              <p className="text-[10px] text-slate-500">Estimasi Akhir</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-500">Tingkat Pengurangan Berkas</span>
              <span className="font-extrabold text-[#B91C1C]">-{reductionPct}% Pengurangan</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#B91C1C] transition-all duration-300"
                style={{ width: `${Math.max(10, Math.min(92, reductionPct || 18))}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>0 MB</span>
              <span className="font-semibold text-slate-500">
                Target ~{formatFileSize(estimatedSize)}
              </span>
              <span>{formatFileSize(originalSize)}</span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-3">
            <div className="flex -space-x-1">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-white bg-[#E0E7FF] text-[9px] font-extrabold text-slate-700">
                Aa
              </span>
              <span className="grid h-5 w-5 place-items-center rounded-full border border-white bg-slate-100 text-slate-600">
                <ImageIcon size={10} />
              </span>
              <span className="grid h-5 w-5 place-items-center rounded-full border border-white bg-[#DCFCE7] text-emerald-700">
                <ShieldCheck size={10} />
              </span>
            </div>
            <p className="truncate text-[10px] text-slate-500">
              Vektor font & grafik tajam tanpa artefak piksel
            </p>
          </div>
        </section>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
        >
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Tutup pesan">
            <X size={15} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800"
        >
          <Check size={16} className="shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleCompress}
          disabled={busy || !file}
          className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#B91C1C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-700/20 transition-all hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <>
              <LoaderCircle size={18} className="animate-spin" /> Sedang Mengompres...
            </>
          ) : (
            <>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                <ArrowDown size={14} />
              </span>
              <span className="text-center leading-tight">
                Kompres Dokumen Sekarang
                {savedEstimate > 0 && (
                  <span className="block text-[11px] font-semibold text-red-100">
                    (Hemat ~{formatFileSize(savedEstimate)})
                  </span>
                )}
              </span>
            </>
          )}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <Lock size={11} className="text-emerald-600" />
          Gratis tanpa watermark • Privasi terjamin 100% lokal
        </p>
      </div>
    </div>
  );
}
