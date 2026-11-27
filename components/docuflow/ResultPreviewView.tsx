"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileArchive,
  FileText,
  Grid2x2,
  LayoutGrid,
  Lock,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { formatFileSize, saveBlob } from "@/lib/pdf-utils";
import PdfPageThumb from "./PdfPageThumb";
import type { ProcessedResult } from "./types";

interface ResultPreviewViewProps {
  result: ProcessedResult;
  onReset: () => void;
  onBackToTool: () => void;
}

export default function ResultPreviewView({
  result,
  onReset,
  onBackToTool,
}: ResultPreviewViewProps) {
  const [previewMode, setPreviewMode] = useState<"single" | "grid">("single");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [shareNote, setShareNote] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isPdf = result.blob.type === "application/pdf" && !!result.pdfBuffer;
  const isImage = result.blob.type.startsWith("image/");
  const isZip = !isPdf && !isImage && !!result.zipEntries;
  const totalPages = result.pageCount ?? 1;

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(result.blob);
    const frame = requestAnimationFrame(() => setImageUrl(url));
    return () => {
      cancelAnimationFrame(frame);
      URL.revokeObjectURL(url);
    };
  }, [isImage, result.blob]);

  const savedBytes =
    result.originalSize && result.originalSize > result.blob.size
      ? result.originalSize - result.blob.size
      : 0;
  const savedPct =
    result.originalSize && savedBytes > 0
      ? Math.round((savedBytes / result.originalSize) * 100)
      : 0;

  const handleDownload = () => {
    saveBlob(result.blob, result.fileName);
    setDownloaded(true);
  };

  const handleShare = async () => {
    setShareNote("");
    try {
      const file = new File([result.blob], result.fileName, { type: result.blob.type });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: result.fileName,
          text: "Dokumen diproses menggunakan DocuFlow",
          files: [file],
        });
        return;
      }
      saveBlob(result.blob, result.fileName);
      setShareNote("Browser tidak mendukung Web Share langsung — file telah diunduh.");
    } catch {
      // User cancelled native share sheet
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Status & Heading */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
          <CheckCircle2 size={13} /> Berhasil Diproses • Siap Diunduh
        </span>
        <h1 className="mt-2.5 text-[24px] font-extrabold tracking-tight text-[#0F172A]">
          Dokumen Anda Siap!
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-[#64748B]">
          Berkas telah selesai diproses secara lokal. Periksa pratinjau di bawah sebelum
          mengunduh.
        </p>
      </div>

      {/* Document Summary Card */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFE4E6] text-[#B91C1C]">
              {isZip ? <FileArchive size={22} /> : <FileText size={22} />}
              <span className="absolute -bottom-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase">
                Selesai
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
                {result.badgeLabel}
              </p>
              <p className="truncate text-sm font-extrabold text-[#0F172A]">{result.fileName}</p>
              <p className="text-[11px] text-slate-400">Dibuat baru saja • Siap cetak & kirim</p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
            {savedPct > 0 ? `-${savedPct}% Hemat` : "Optimal"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-[#F8FAFF] p-3">
            <p className="text-[10px] font-medium text-slate-500">Ukuran Akhir</p>
            <p className="mt-0.5 flex items-baseline gap-1.5 text-base font-extrabold text-[#0F172A]">
              <span>{formatFileSize(result.blob.size)}</span>
              {savedBytes > 0 && result.originalSize && (
                <span className="text-[11px] font-semibold text-slate-400 line-through">
                  {formatFileSize(result.originalSize)}
                </span>
              )}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFF] p-3">
            <p className="text-[10px] font-medium text-slate-500">
              {isZip ? "Jumlah Berkas" : "Jumlah Halaman"}
            </p>
            <p className="mt-0.5 text-base font-extrabold text-[#0F172A]">
              {isZip
                ? `${result.zipEntries?.length ?? 0} Berkas PDF`
                : isImage
                  ? "1 Gambar"
                  : `${totalPages} Halaman`}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFF] p-3">
            <p className="text-[10px] font-medium text-slate-500">Kualitas Teks</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-extrabold text-emerald-700">
              <CheckCircle2 size={13} /> 100% Terjaga
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFF] p-3">
            <p className="text-[10px] font-medium text-slate-500">Pemrosesan</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-extrabold text-slate-700">
              <Lock size={12} /> 100% Lokal
            </p>
          </div>
        </div>
      </section>

      {/* Pratinjau Lembar */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-[#B91C1C]" />
            <h2 className="text-sm font-extrabold text-[#0F172A]">Pratinjau Lembar</h2>
          </div>

          {isPdf && totalPages > 1 && (
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPreviewMode("single")}
                className={`rounded-lg px-2.5 py-1 transition-colors ${
                  previewMode === "single"
                    ? "bg-white text-[#0F172A] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Satu
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("grid")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                  previewMode === "grid"
                    ? "bg-white text-[#0F172A] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Grid2x2 size={11} /> Grid {totalPages}
              </button>
            </div>
          )}
        </div>

        {/* PDF Preview */}
        {isPdf && result.pdfBuffer && (
          <>
            {previewMode === "single" ? (
              <div className="space-y-3">
                <div className="relative flex justify-center overflow-auto rounded-2xl bg-[#F4F7FF] p-4">
                  <button
                    type="button"
                    onClick={() => setZoomed((z) => !z)}
                    title={zoomed ? "Perkecil pratinjau" : "Perbesar pratinjau"}
                    className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-900/80 text-white shadow-sm hover:bg-slate-900"
                  >
                    {zoomed ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <div className="overflow-hidden rounded-xl bg-white shadow-md">
                    <PdfPageThumb
                      pdfData={result.pdfBuffer}
                      pageNumber={currentPage}
                      width={zoomed ? 420 : 280}
                    />
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Halaman sebelumnya"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      Halaman {currentPage} dari {totalPages}
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </p>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Halaman berikutnya"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      setPreviewMode("single");
                    }}
                    className="flex flex-col items-center rounded-xl border border-slate-100 bg-[#F8FAFF] p-2 hover:border-[#B91C1C]/40"
                  >
                    <PdfPageThumb pdfData={result.pdfBuffer!} pageNumber={pageNum} width={130} />
                    <span className="mt-1.5 text-[10px] font-bold text-slate-600">
                      Halaman {pageNum}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Image Preview */}
        {isImage && imageUrl && (
          <div className="flex justify-center rounded-2xl bg-[#F4F7FF] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Pratinjau ${result.fileName}`}
              className="max-h-96 rounded-xl object-contain shadow-md"
            />
          </div>
        )}

        {/* ZIP Contents Preview */}
        {isZip && result.zipEntries && (
          <div className="space-y-2 rounded-2xl bg-[#F4F7FF] p-3">
            {result.zipEntries.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs shadow-2xs"
              >
                <span className="flex items-center gap-2 truncate font-bold text-slate-800">
                  <FileText size={14} className="shrink-0 text-[#B91C1C]" />
                  <span className="truncate">{entry.name}</span>
                </span>
                <span className="shrink-0 text-[11px] text-slate-500">
                  {formatFileSize(entry.size)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Download CTA & Secondary Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleDownload}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D91B24] px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-[#B8141C]"
        >
          {downloaded ? <Check size={18} /> : <Download size={18} />}
          <span>
            {downloaded ? "Unduh Lagi" : "Unduh Dokumen Sekarang"} ({formatFileSize(result.blob.size)})
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50"
          >
            <Share2 size={15} /> Bagikan Berkas
          </button>
          <button
            type="button"
            onClick={onBackToTool}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> Ubah Pengaturan
          </button>
        </div>

        {shareNote && (
          <p className="text-center text-[11px] font-medium text-emerald-700">{shareNote}</p>
        )}
      </div>

      {/* Privacy & Process Another */}
      <section className="rounded-2xl bg-[#EFF4FF] p-4 text-center">
        <div className="flex items-start gap-2.5 text-left">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-[11px] leading-relaxed text-slate-600">
            Demi privasi dan keamanan Anda, seluruh pemrosesan terjadi{" "}
            <strong className="text-slate-800">100% di memori browser Anda</strong> dan tidak
            pernah disimpan di server mana pun.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#B91C1C] hover:underline"
        >
          <RotateCcw size={13} /> Proses Berkas Lainnya
        </button>
      </section>
    </div>
  );
}
