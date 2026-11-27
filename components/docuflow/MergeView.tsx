"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  FilePlus2,
  FileText,
  GripVertical,
  Layers,
  LoaderCircle,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { formatFileSize, getPdfPageCount } from "@/lib/pdf-utils";
import type { PdfQueueItem, ProcessedResult } from "./types";

interface MergeViewProps {
  initialFiles?: File[];
  onPreview: (result: ProcessedResult) => void;
}

export default function MergeView({ initialFiles, onPreview }: MergeViewProps) {
  const [items, setItems] = useState<PdfQueueItem[]>([]);
  const [autoPageNumbers, setAutoPageNumbers] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const buildQueueItems = async (pdfs: File[]): Promise<PdfQueueItem[]> =>
    Promise.all(
      pdfs.map(async (file, idx) => {
        let pageCount: number | null = null;
        try {
          pageCount = await getPdfPageCount(file);
        } catch {
          pageCount = null;
        }
        return {
          id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          pageCount,
        };
      }),
    );

  const addFiles = async (newFiles: File[]) => {
    const pdfs = newFiles.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) {
      setError("Hanya file PDF yang dapat digabungkan.");
      return;
    }
    setError("");
    setNotice("");
    const entries = await buildQueueItems(pdfs);
    setItems((prev) => [...prev, ...entries].slice(0, 20));
  };

  useEffect(() => {
    if (!initialFiles || initialFiles.length === 0) return;
    let active = true;
    const pdfs = initialFiles.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) return;
    void buildQueueItems(pdfs).then((entries) => {
      if (active) setItems(entries.slice(0, 20));
    });
    return () => {
      active = false;
    };
  }, [initialFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (accepted) => void addFiles(accepted),
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 20,
    noClick: true,
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const totalPages = items.reduce((sum, item) => sum + (item.pageCount ?? 0), 0);
  const totalBytes = items.reduce((sum, item) => sum + item.file.size, 0);

  const handleMerge = async () => {
    setError("");
    setNotice("");
    if (items.length < 2) {
      setError("Tambahkan minimal 2 file PDF untuk digabungkan.");
      return;
    }
    setBusy(true);
    try {
      const merged = await PDFDocument.create();
      for (const item of items) {
        const source = await PDFDocument.load(await item.file.arrayBuffer());
        const copied = await merged.copyPages(source, source.getPageIndices());
        copied.forEach((page) => merged.addPage(page));
      }

      if (autoPageNumbers) {
        const font = await merged.embedFont(StandardFonts.Helvetica);
        const pages = merged.getPages();
        pages.forEach((page, index) => {
          const { width } = page.getSize();
          const label = `${index + 1} / ${pages.length}`;
          const textWidth = font.widthOfTextAtSize(label, 9);
          page.drawText(label, {
            x: (width - textWidth) / 2,
            y: 16,
            size: 9,
            font,
            color: rgb(0.39, 0.45, 0.55),
          });
        });
      }

      const bytes = await merged.save();
      const outName = "docuflow-gabungan.pdf";
      const pdfBuffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      onPreview({
        id: crypto.randomUUID(),
        fileName: outName,
        badgeLabel: "Hasil Gabung PDF",
        actionLabel: "Digabung",
        blob,
        pdfBuffer,
        pageCount: merged.getPageCount(),
        originalSize: totalBytes,
        sourceView: "merge",
      });
    } catch {
      setError("Salah satu PDF tidak bisa dibaca atau dilindungi kata sandi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#D91B24] uppercase">
          <Layers size={11} /> Multi-Merge V2.4
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          Gabungkan Beberapa File PDF
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
          Atur urutan file dengan menarik kartu ke atas atau bawah sebelum digabungkan.
        </p>
      </div>

      {/* Dropzone Card */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragActive
            ? "border-[#D91B24] bg-red-50/50"
            : "border-slate-300/90 bg-white hover:border-slate-400"
        }`}
      >
        <input {...getInputProps()} />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-[#D91B24]">
          <UploadCloud size={23} />
        </span>
        <p className="mt-3 text-sm font-bold text-slate-900">
          {isDragActive ? "Lepaskan file PDF di sini" : "Ketuk untuk Tambah PDF"}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">atau seret & letakkan berkas dokumen ke sini</p>
        <span className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">
          Maks. 20 berkas • Diproses lokal
        </span>
        <button
          type="button"
          onClick={open}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#D91B24] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-red-600/20 hover:bg-[#B8141C]"
        >
          <FilePlus2 size={15} /> Tambah File Lain
        </button>
      </div>

      {/* File Order List */}
      {items.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Urutan Dokumen</h2>
              <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {items.length} Berkas
              </span>
            </div>
            <button
              type="button"
              onClick={() => setItems([])}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-600"
            >
              <Trash2 size={13} /> Hapus semua
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="docuflow-merge-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(drag, snapshot) => (
                        <div
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          style={drag.draggableProps.style}
                          className={`flex items-center gap-2.5 rounded-2xl border bg-white p-3 transition-shadow ${
                            snapshot.isDragging
                              ? "border-[#D91B24] shadow-lg"
                              : "border-slate-200/90 shadow-xs"
                          }`}
                        >
                          <button
                            type="button"
                            aria-label="Geser urutan"
                            {...drag.dragHandleProps}
                            className="grid h-8 w-6 shrink-0 cursor-grab place-items-center text-slate-400 hover:text-slate-700"
                          >
                            <GripVertical size={16} />
                          </button>

                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                            {index + 1}
                          </span>

                          <span className="grid h-10 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-[#D91B24]">
                            <FileText size={18} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900" title={item.file.name}>
                              {item.file.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {item.pageCount !== null ? `${item.pageCount} Halaman • ` : ""}
                              {formatFileSize(item.file.size)}
                            </p>
                          </div>

                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              aria-label="Naikkan"
                              disabled={index === 0}
                              onClick={() => moveItem(index, -1)}
                              className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label="Turunkan"
                              disabled={index === items.length - 1}
                              onClick={() => moveItem(index, 1)}
                              className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${item.file.name}`}
                              onClick={() => setItems((prev) => prev.filter((p) => p.id !== item.id))}
                              className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      )}

      {/* Dark Slate Ringkasan Output Card */}
      <section className="rounded-2xl bg-[#0F172A] p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-bold tracking-wide text-slate-100">Ringkasan Output</h3>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
            PDF Tunggal
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-slate-800/80 p-3">
            <p className="text-[10px] font-medium text-slate-400">Jumlah Halaman</p>
            <p className="mt-1 text-base font-extrabold text-white">{totalPages} Halaman</p>
          </div>
          <div className="rounded-xl bg-slate-800/80 p-3">
            <p className="text-[10px] font-medium text-slate-400">Estimasi Ukuran</p>
            <p className="mt-1 text-base font-extrabold text-white">
              {formatFileSize(totalBytes)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-800/50 px-3 py-2.5">
          <div>
            <p className="text-xs font-bold text-slate-100">Penomoran Halaman Otomatis</p>
            <p className="text-[10px] text-slate-400">
              Sertakan nomor urutan di footer setiap halaman
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoPageNumbers}
            onClick={() => setAutoPageNumbers((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              autoPageNumbers ? "bg-[#D91B24]" : "bg-slate-600"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                autoPageNumbers ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
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

      <button
        type="button"
        onClick={handleMerge}
        disabled={busy || items.length < 2}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D91B24] px-6 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all hover:bg-[#B8141C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? (
          <>
            <LoaderCircle size={18} className="animate-spin" /> Menggabungkan PDF...
          </>
        ) : (
          <>
            Gabungkan {items.length || ""} PDF Sekarang <ArrowRight size={17} />
          </>
        )}
      </button>
    </div>
  );
}
