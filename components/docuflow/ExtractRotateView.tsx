"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import {
  Check,
  CheckSquare,
  Download,
  FileText,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Scissors,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  createZipBlob,
  formatFileSize,
  parsePageRanges,
} from "@/lib/pdf-utils";
import PdfPageThumb from "./PdfPageThumb";
import type { ProcessedResult } from "./types";

interface ExtractRotateViewProps {
  initialFile?: File | null;
  onPreview: (result: ProcessedResult) => void;
}

interface PageState {
  pageNumber: number;
  selected: boolean;
  rotation: number;
}

export default function ExtractRotateView({
  initialFile,
  onPreview,
}: ExtractRotateViewProps) {
  const [file, setFile] = useState<File | null>(null);
  /** Stable ArrayBuffer copy used only for thumbnail rendering */
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
  const [mode, setMode] = useState<"extract" | "remove">("extract");
  const [outputFormat, setOutputFormat] = useState<"single" | "zip">("single");
  const [rangeInput, setRangeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPdfFile = async (pdfFile: File) => {
    setError("");
    setNotice("");
    try {
      const buffer = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const count = doc.getPageCount();
      setFile(pdfFile);
      // Keep a separate copy of the buffer for thumbnails
      setPdfBuffer(buffer.slice(0));
      setPages(
        Array.from({ length: count }, (_, idx) => ({
          pageNumber: idx + 1,
          selected: idx < Math.min(4, count),
          rotation: 0,
        })),
      );
      setRangeInput(count > 1 ? `1-${Math.min(4, count)}` : "1");
    } catch {
      setError("PDF tidak bisa dibaca. Pastikan file tidak rusak atau dilindungi kata sandi.");
    }
  };

  useEffect(() => {
    if (!initialFile) return;
    let active = true;
    void initialFile
      .arrayBuffer()
      .then((buf) => PDFDocument.load(buf).then((doc) => ({ buf, doc })))
      .then(({ buf, doc }) => {
        if (!active) return;
        const count = doc.getPageCount();
        setFile(initialFile);
        setPdfBuffer(buf.slice(0));
        setPages(
          Array.from({ length: count }, (_, idx) => ({
            pageNumber: idx + 1,
            selected: idx < Math.min(4, count),
            rotation: 0,
          })),
        );
        setRangeInput(count > 1 ? `1-${Math.min(4, count)}` : "1");
      })
      .catch(() => {
        if (active)
          setError("PDF tidak bisa dibaca. Pastikan file tidak rusak atau dilindungi kata sandi.");
      });
    return () => { active = false; };
  }, [initialFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (accepted) => {
      if (accepted[0]) void loadPdfFile(accepted[0]);
    },
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    noClick: true,
  });

  const selectedCount = pages.filter((p) => p.selected).length;

  const togglePage = (pageNumber: number) =>
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p)),
    );

  const rotatePage = (pageNumber: number) =>
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === pageNumber ? { ...p, rotation: (p.rotation + 90) % 360 } : p,
      ),
    );

  const rotateSelectedOrAll = () => {
    const hasSelection = selectedCount > 0;
    setPages((prev) =>
      prev.map((p) =>
        !hasSelection || p.selected ? { ...p, rotation: (p.rotation + 90) % 360 } : p,
      ),
    );
  };

  const selectAll = () => {
    const allSelected = pages.every((p) => p.selected);
    setPages((prev) => prev.map((p) => ({ ...p, selected: !allSelected })));
  };

  const resetAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false, rotation: 0 })));
    setRangeInput("");
  };

  const applyRange = () => {
    if (!pages.length) return;
    setError("");
    try {
      const indices = new Set(parsePageRanges(rangeInput, pages.length));
      setPages((prev) => prev.map((p, idx) => ({ ...p, selected: indices.has(idx) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Format rentang halaman tidak valid.");
    }
  };

  const handleSaveRotationOnly = async () => {
    if (!file) return;
    setError(""); setNotice(""); setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach((page, idx) => {
        const rot = pages[idx]?.rotation ?? 0;
        if (rot !== 0)
          page.setRotation(degrees((page.getRotation().angle + rot) % 360));
      });
      const bytes = await doc.save();
      const outName = `${file.name.replace(/\.pdf$/i, "")}-rotasi.pdf`;
      const pdfBuffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      onPreview({
        id: `${Date.now()}`,
        fileName: outName,
        badgeLabel: "PDF Diputar",
        actionLabel: "Diputar",
        blob,
        pdfBuffer,
        pageCount: doc.getPageCount(),
        originalSize: file.size,
        sourceView: "extract-rotate",
      });
    } catch {
      setError("Gagal menyimpan rotasi halaman.");
    } finally { setBusy(false); }
  };

  const handleExtract = async () => {
    if (!file) return;
    setError(""); setNotice("");

    const targetPages =
      mode === "extract"
        ? pages.filter((p) => p.selected)
        : pages.filter((p) => !p.selected);

    if (targetPages.length === 0) {
      setError(
        mode === "extract"
          ? "Pilih setidaknya 1 halaman untuk diekstrak."
          : "Tidak ada halaman tersisa jika semua halaman dihapus.",
      );
      return;
    }

    setBusy(true);
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const baseName = file.name.replace(/\.pdf$/i, "");

      if (outputFormat === "single") {
        const outDoc = await PDFDocument.create();
        const indices = targetPages.map((p) => p.pageNumber - 1);
        const copied = await outDoc.copyPages(source, indices);
        copied.forEach((page, i) => {
          const rot = targetPages[i].rotation;
          if (rot !== 0)
            page.setRotation(degrees((page.getRotation().angle + rot) % 360));
          outDoc.addPage(page);
        });
        const bytes = await outDoc.save();
        const outName = `${baseName}-ekstrak.pdf`;
        const pdfBuffer = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ) as ArrayBuffer;
        const blob = new Blob([pdfBuffer], { type: "application/pdf" });
        onPreview({
          id: `${Date.now()}`,
          fileName: outName,
          badgeLabel: "Hasil Ekstrak PDF",
          actionLabel: "Diekstrak",
          blob,
          pdfBuffer,
          pageCount: outDoc.getPageCount(),
          originalSize: file.size,
          sourceView: "extract-rotate",
        });
      } else {
        const zipEntries: { name: string; data: Uint8Array }[] = [];
        for (const tp of targetPages) {
          const singleDoc = await PDFDocument.create();
          const [copied] = await singleDoc.copyPages(source, [tp.pageNumber - 1]);
          if (tp.rotation !== 0)
            copied.setRotation(degrees((copied.getRotation().angle + tp.rotation) % 360));
          singleDoc.addPage(copied);
          const bytes = await singleDoc.save();
          zipEntries.push({ name: `${baseName}-halaman-${tp.pageNumber}.pdf`, data: bytes });
        }
        const zipBlob = createZipBlob(zipEntries);
        const outName = `${baseName}-halaman.zip`;
        onPreview({
          id: `${Date.now()}`,
          fileName: outName,
          badgeLabel: "Arsip Halaman ZIP",
          actionLabel: "Diekstrak",
          blob: zipBlob,
          zipEntries: zipEntries.map((e) => ({ name: e.name, size: e.data.byteLength })),
          originalSize: file.size,
          sourceView: "extract-rotate",
        });
      }
    } catch {
      setError("Gagal mengekstrak halaman PDF.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
          Ekstrak & Putar Halaman
        </h1>
        <p className="mt-1 text-[12px] leading-relaxed text-[#64748B] sm:text-[13px]">
          Pilih halaman yang ingin disimpan terpisah, atau putar orientasi halaman sesuai kebutuhan.
        </p>
      </div>

      {/* Dropzone / Active File Banner */}
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
              <UploadCloud size={24} />
            </span>
            <p className="mt-3 text-sm font-bold text-slate-900">
              {isDragActive ? "Lepaskan PDF di sini" : "Pilih file PDF untuk diatur"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Lihat semua halaman, putar orientasi, dan ekstrak halaman pilihan
            </p>
            <button
              type="button"
              onClick={open}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#B91C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#991B1B]"
            >
              Pilih File PDF
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFE4E6] text-[#B91C1C]">
                  <FileText size={19} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {pages.length} Halaman • {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={open}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={12} /> Ganti
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={rotateSelectedOrAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                <RotateCw size={13} /> Putar 90°
              </button>
              <button
                type="button"
                onClick={selectAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                <CheckSquare size={13} /> Pilih Semua
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {file && pdfBuffer && (
        <>
          {/* Mode Tabs & Range Input */}
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode("extract")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === "extract"
                    ? "bg-white text-[#B91C1C] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scissors size={13} /> Ekstrak ({selectedCount} Hal)
              </button>
              <button
                type="button"
                onClick={() => setMode("remove")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === "remove"
                    ? "bg-white text-[#B91C1C] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Trash2 size={13} /> Hapus Pilihan
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="Contoh: 1-2, 4-5"
                aria-label="Rentang halaman"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#B91C1C] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={applyRange}
                className="h-10 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
              >
                Terapkan
              </button>
            </div>
          </div>

          {/* Page Grid — real PDF thumbnails */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                Pratinjau Halaman
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                {selectedCount} / {pages.length} dipilih
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className={`group relative flex flex-col rounded-2xl border bg-white p-2.5 pb-3 transition-all ${
                    p.selected
                      ? "border-[#B91C1C] ring-2 ring-[#B91C1C]/10"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  {/* Selection toggle checkbox */}
                  <button
                    type="button"
                    onClick={() => togglePage(p.pageNumber)}
                    aria-label={`Pilih halaman ${p.pageNumber}`}
                    className={`absolute top-2.5 left-2.5 z-10 grid h-5 w-5 place-items-center rounded-full border-2 shadow-xs transition-all ${
                      p.selected
                        ? "border-[#B91C1C] bg-[#B91C1C] text-white"
                        : "border-white bg-white/80 text-transparent hover:border-slate-300"
                    }`}
                  >
                    <Check size={11} strokeWidth={3} />
                  </button>

                  {/* Page number badge */}
                  <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {p.pageNumber}
                  </span>

                  {/* Real PDF page thumbnail */}
                  <button
                    type="button"
                    onClick={() => togglePage(p.pageNumber)}
                    className="relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-100"
                    style={{ minHeight: 120 }}
                    aria-label={`Halaman ${p.pageNumber}`}
                  >
                    <PdfPageThumb
                      pdfData={pdfBuffer}
                      pageNumber={p.pageNumber}
                      extraRotation={p.rotation}
                      width={150}
                    />
                  </button>

                  {/* Rotation status + rotate button */}
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p
                        className={`text-[11px] font-bold leading-none ${
                          p.selected ? "text-[#B91C1C]" : "text-slate-400"
                        }`}
                      >
                        {p.selected ? "Terpilih" : "Dilewati"}
                      </p>
                      {p.rotation !== 0 && (
                        <p className="mt-0.5 text-[10px] text-slate-400">{p.rotation}°</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => rotatePage(p.pageNumber)}
                      title={`Putar halaman ${p.pageNumber} 90°`}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-[#B91C1C]"
                    >
                      <RotateCw size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Extraction Output Options */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Pilihan Hasil Ekstraksi</h3>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                Siap Diproses
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {[
                {
                  value: "single" as const,
                  title: "Gabungkan Menjadi 1 Berkas PDF Baru",
                  sub: "Halaman terpilih akan disatukan berurutan",
                },
                {
                  value: "zip" as const,
                  title: "Pisahkan Tiap Halaman (Format ZIP)",
                  sub: "Menghasilkan berkas PDF individual dalam satu ZIP",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOutputFormat(opt.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    outputFormat === opt.value
                      ? "border-[#B91C1C]/40 bg-[#FFF5F5]"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                      outputFormat === opt.value
                        ? "border-[#B91C1C] bg-[#B91C1C]"
                        : "border-slate-300"
                    }`}
                  >
                    {outputFormat === opt.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                    <p className="text-[11px] text-slate-500">{opt.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

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

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleSaveRotationOnly}
              disabled={busy}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 disabled:opacity-50"
            >
              <RotateCw size={16} /> Simpan Rotasi Saja
            </button>
            <button
              type="button"
              onClick={handleExtract}
              disabled={busy}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#B91C1C] px-4 text-xs font-bold text-white shadow-md shadow-red-600/20 hover:bg-[#991B1B] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <Download size={16} />
                  {mode === "extract" ? "Ekstrak Halaman" : "Simpan Tanpa Pilihan"}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
