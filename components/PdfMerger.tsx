"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PDFDocument, degrees } from "pdf-lib";
import {
  ArrowDown, ArrowDownUp, ArrowRight, ArrowUp, Check, Combine,
  Download, FilePlus2, FileStack, FileText, Files, Image as ImageIcon, LoaderCircle, RotateCw,
  Scissors, ShieldCheck, Shrink, Trash2, UploadCloud, X,
} from "lucide-react";

type Tool = "merge" | "extract" | "rotate" | "compress";

const tools: { id: Tool; label: string; description: string; icon: typeof Combine }[] = [
  { id: "merge", label: "Gabung", description: "Satukan beberapa file", icon: Combine },
  { id: "extract", label: "Ekstrak", description: "Ambil halaman pilihan", icon: Scissors },
  { id: "rotate", label: "Rotasi", description: "Putar halaman PDF", icon: RotateCw },
  { id: "compress", label: "Kompres", description: "PDF dan gambar, dimensi tetap", icon: Shrink },
];

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function savePdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Gambar gagal diproses.")), type, quality);
  });
}

async function compressImage(file: File, quality = 0.9) {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Browser tidak dapat memproses gambar ini.");
    context.drawImage(bitmap, 0, 0);
    const outputQuality = file.type === "image/png" ? undefined : quality;
    const blob = await canvasToBlob(canvas, file.type, outputQuality);
    return { blob, width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close();
  }
}

function parsePageRanges(input: string, pageCount: number) {
  const pages = new Set<number>();
  for (const rawPart of input.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Gunakan format halaman seperti 1, 3-5, 8.");
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start || end > pageCount) {
      throw new Error(`Rentang halaman harus berada di antara 1 dan ${pageCount}.`);
    }
    for (let page = start; page <= end; page++) pages.add(page - 1);
  }
  if (!pages.size) throw new Error("Masukkan setidaknya satu halaman untuk diekstrak.");
  return [...pages].sort((a, b) => a - b);
}

export default function PdfMerger() {
  const [tool, setTool] = useState<Tool>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-3");
  const [rotation, setRotation] = useState(90);
  const [compressionQuality, setCompressionQuality] = useState(85);
  const [imageEstimate, setImageEstimate] = useState<{ file: File; quality: number; size: number } | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 20));
    setError("");
    setNotice("");
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: tool === "compress"
      ? { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
      : { "application/pdf": [".pdf"] },
    maxFiles: 20,
    noClick: true,
  });

  const selectedImage = files[0];
  const canSetImageQuality = !!selectedImage && (selectedImage.type === "image/jpeg" || selectedImage.type === "image/webp");
  const currentEstimate = imageEstimate !== null && imageEstimate.file === selectedImage && imageEstimate.quality === compressionQuality
    ? imageEstimate.size
    : null;

  useEffect(() => {
    if (tool !== "compress" || !selectedImage || !canSetImageQuality) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setEstimating(true);
      void compressImage(selectedImage, compressionQuality / 100)
        .then(({ blob }) => {
          if (active) setImageEstimate({ file: selectedImage, quality: compressionQuality, size: blob.size });
        })
        .catch(() => {
          if (active) setImageEstimate(null);
        })
        .finally(() => {
          if (active) setEstimating(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [tool, selectedImage, canSetImageQuality, compressionQuality]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...files];
    const [item] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, item);
    setFiles(reordered);
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const processPdf = async () => {
    setError(""); setNotice("");
    if (!files.length) { setError(tool === "compress" ? "Pilih satu PDF atau gambar terlebih dahulu." : "Pilih file PDF terlebih dahulu."); return; }
    if (tool === "merge" && files.length < 2) { setError("Tambahkan setidaknya 2 file untuk digabungkan."); return; }
    if (tool !== "merge" && files.length !== 1) { setError("Pilih tepat 1 file untuk alat ini."); return; }
    setBusy(true);
    try {
      if (tool === "merge") {
        const output = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer());
          const pages = await output.copyPages(source, source.getPageIndices());
          pages.forEach((page) => output.addPage(page));
        }
        savePdf(await output.save(), "pdfcraft-gabungan.pdf");
        setNotice(`${files.length} file berhasil digabungkan.`);
      } else if (tool === "compress") {
        const originalSize = files[0].size;
        if (files[0].type === "application/pdf") {
          const output = await PDFDocument.load(await files[0].arrayBuffer());
          const compressedBytes = await output.save({ useObjectStreams: true });
          savePdf(compressedBytes, "pdfcraft-kompres.pdf");
          const savedBytes = originalSize - compressedBytes.byteLength;
          if (savedBytes > 0) {
            const percentage = Math.round((savedBytes / originalSize) * 100);
            setNotice(`Ukuran ${formatFileSize(originalSize)} → ${formatFileSize(compressedBytes.byteLength)} (hemat ${percentage}%). Resolusi gambar dan ukuran halaman PDF tetap.`);
          } else {
            setNotice(`PDF sudah dioptimasi tanpa mengubah resolusi. Ukuran hasil ${formatFileSize(compressedBytes.byteLength)} (file awal ${formatFileSize(originalSize)}); penghematan bergantung pada isi PDF.`);
          }
        } else if (imageTypes[files[0].type]) {
          const { blob, width, height } = await compressImage(files[0], compressionQuality / 100);
          const extension = imageTypes[files[0].type];
          const name = files[0].name.replace(/\.[^.]+$/, "") || "gambar";
          saveBlob(blob, `${name}-kompres.${extension}`);
          const savedBytes = originalSize - blob.size;
          const resultSize = formatFileSize(blob.size);
          if (savedBytes > 0) {
            const percentage = Math.round((savedBytes / originalSize) * 100);
            setNotice(`Ukuran ${formatFileSize(originalSize)} → ${resultSize} (hemat ${percentage}%). Dimensi tetap ${width} × ${height} px${extension !== "png" ? `; kualitas gambar ${compressionQuality}%` : "; kompresi PNG lossless"}.`);
          } else {
            setNotice(`Dimensi gambar tetap ${width} × ${height} px, tetapi hasil (${resultSize}) tidak lebih kecil dari file awal. Coba gambar lain${extension !== "png" ? ` atau turunkan kualitas ke ${compressionQuality}%` : "; PNG diproses lossless"}.`);
          }
        } else {
          setError("Format belum didukung. Pilih PDF, JPG, PNG, atau WebP.");
        }
      } else {
        const output = await PDFDocument.load(await files[0].arrayBuffer());
        if (tool === "extract") {
          const selected = parsePageRanges(range, output.getPageCount());
          const extracted = await PDFDocument.create();
          const pages = await extracted.copyPages(output, selected);
          pages.forEach((page) => extracted.addPage(page));
          savePdf(await extracted.save(), "pdfcraft-halaman-pilihan.pdf");
          setNotice(`${selected.length} halaman berhasil diekstrak.`);
        } else {
          output.getPages().forEach((page) => page.setRotation(degrees((page.getRotation().angle + rotation) % 360)));
          savePdf(await output.save(), "pdfcraft-rotasi.pdf");
          setNotice(`Semua halaman diputar ${rotation}°. File siap diunduh.`);
        }
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      setError(message.startsWith("Gunakan") || message.startsWith("Rentang") || message.startsWith("Masukkan")
        ? message
        : tool === "compress" ? "File tidak bisa diproses. Pastikan formatnya PDF, JPG, PNG, atau WebP dan file tidak rusak."
          : "PDF tidak bisa dibaca. Pastikan file tidak rusak atau dilindungi kata sandi.");
    } finally { setBusy(false); }
  };

  const currentTool = tools.find((item) => item.id === tool)!;
  const CurrentIcon = currentTool.icon;

  return (
    <main className="workspace">
      <section className="hero">
        <div className="hero-eyebrow"><span className="eyebrow-dot" /> WORKSPACE PDF PRIBADI</div>
        <h1>Semua urusan PDF,<br /><span>jadi lebih mudah.</span></h1>
        <p>Atur dokumen langsung dari perangkatmu. Cepat, simpel, dan file tetap privat.</p>
        <div className="privacy-note"><ShieldCheck size={15} /> File diproses lokal di browser, tidak diunggah</div>
      </section>

      <section className="editor-shell" aria-label="Alat pengolah PDF">
        <div className="tool-tabs" role="tablist" aria-label="Pilih alat PDF">
          {tools.map(({ id, label, description, icon: Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={tool === id} className={`tool-tab ${tool === id ? "active" : ""}`} onClick={() => { setTool(id); setError(""); setNotice(""); }}>
              <span className="tool-icon"><Icon size={18} /></span>
              <span className="tool-copy"><strong>{label}</strong><small>{description}</small></span>
              {tool === id && <Check className="tab-check" size={15} />}
            </button>
          ))}
        </div>

        <div className="editor-content">
          <div className="section-heading">
            <div className="section-icon"><CurrentIcon size={19} /></div>
            <div><h2>{tool === "merge" ? "Gabungkan PDF" : tool === "extract" ? "Ekstrak halaman" : tool === "rotate" ? "Rotasi halaman" : "Kompres PDF atau gambar"}</h2>
              <p>{tool === "merge" ? "Susun file sesuai urutan yang kamu inginkan." : tool === "extract" ? "Pilih halaman tertentu dan simpan sebagai PDF baru." : tool === "rotate" ? "Putar seluruh halaman pada dokumen dengan sekali klik." : "PDF, JPG, PNG, dan WebP. Dimensi piksel gambar tetap; JPG/WebP dikodekan ulang dengan kualitas tinggi."}</p></div>
          </div>

          <div {...getRootProps()} className={`dropzone ${isDragActive ? "dragging" : ""}`}>
            <input {...getInputProps()} />
            <div className="upload-icon"><UploadCloud size={23} /></div>
            <div className="drop-copy"><strong>{isDragActive ? "Lepaskan file di sini" : tool === "compress" ? "Tarik PDF atau gambar ke sini" : "Tarik PDF ke sini"}</strong><span>{tool === "compress" ? "PDF, JPG, PNG, atau WebP" : "atau pilih file dari perangkat"}</span></div>
            <button type="button" className="browse-button" onClick={open}><FilePlus2 size={16} /> Pilih file</button>
          </div>

          {tool === "compress" && selectedImage?.type === "image/png" && <div className="compression-estimate">PNG dikompres lossless. Pengaturan persen kualitas tidak berlaku untuk format ini.</div>}
          {tool === "compress" && selectedImage?.type === "application/pdf" && <div className="compression-estimate">PDF dioptimasi secara lossless; pengaturan persen tidak berlaku agar resolusi gambar tetap terjaga.</div>}
          {tool === "compress" && canSetImageQuality && <div className="field-label compression-control">
            <label htmlFor="image-quality">Kualitas gambar <span>{compressionQuality}% · dimensi piksel tetap</span></label>
            <input id="image-quality" type="range" min="50" max="100" step="1" value={compressionQuality} onChange={(event) => setCompressionQuality(Number(event.target.value))} />
            <div className="compression-estimate" aria-live="polite">
              {currentEstimate !== null
                ? `Perkiraan ukuran: ${formatFileSize(currentEstimate)}${selectedImage.size > currentEstimate ? ` (hemat ${Math.round(((selectedImage.size - currentEstimate) / selectedImage.size) * 100)}%)` : " (belum lebih kecil dari file awal)"}`
                : estimating ? "Menghitung perkiraan ukuran…" : "Perkiraan ukuran akan dihitung dari pengaturan ini."}
            </div>
          </div>}

          {tool === "extract" && <label className="field-label" htmlFor="page-range">Halaman yang diambil <span>pisahkan dengan koma, contoh 1, 3-5, 8</span>
            <input id="page-range" className="text-field" value={range} onChange={(event) => setRange(event.target.value)} placeholder="Contoh: 1-3, 5" inputMode="text" />
          </label>}
          {tool === "rotate" && <div className="field-label">Sudut rotasi <span>Pilih arah putaran</span>
            <div className="rotation-options">{[90, 180, 270].map((angle) => <button type="button" key={angle} className={`rotation-option ${rotation === angle ? "selected" : ""}`} onClick={() => setRotation(angle)}><RotateCw size={15} style={{ transform: `rotate(${angle}deg)` }} /> {angle}°</button>)}</div>
          </div>}

          {!!files.length && <div className="file-section">
            <div className="file-section-heading"><div><h3>{tool === "merge" ? "Urutan dokumen" : "File terpilih"}</h3><span>{files.length} dari 20 file {files.length !== 1 ? "PDF" : "PDF"}</span></div>
              <button className="text-button" type="button" onClick={() => setFiles([])}><Trash2 size={14} /> Hapus semua</button></div>
            {tool !== "merge" && files.length > 1 && <p className="inline-hint">Alat ini bekerja pada satu file. File pertama akan digunakan.</p>}
            <DragDropContext onDragEnd={handleDragEnd}><Droppable droppableId="pdf-list">{(provided) => <div className="file-list" ref={provided.innerRef} {...provided.droppableProps}>
              {files.map((file, index) => <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>{(drag, snapshot) => <div ref={drag.innerRef} {...drag.draggableProps} className={`file-row ${snapshot.isDragging ? "file-dragging" : ""}`} style={drag.draggableProps.style}>
                <button type="button" className="drag-handle" aria-label="Geser untuk mengatur urutan" {...drag.dragHandleProps}><ArrowDownUp size={15} /></button>
                <div className="pdf-badge">{file.type.startsWith("image/") ? <ImageIcon size={18} /> : <FileText size={18} />}</div><div className="file-info"><strong title={file.name}>{file.name}</strong><span>{formatFileSize(file.size)} {tool === "merge" && <em>· File {index + 1}</em>}</span></div>
                {tool === "merge" && <div className="reorder-buttons"><button type="button" aria-label="Naikkan" onClick={() => moveFile(index, -1)} disabled={index === 0}><ArrowUp size={14} /></button><button type="button" aria-label="Turunkan" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1}><ArrowDown size={14} /></button></div>}
                <button type="button" className="remove-button" aria-label={`Hapus ${file.name}`} onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}><X size={17} /></button>
              </div>}</Draggable>)}{provided.placeholder}</div>}</Droppable></DragDropContext>
            <button type="button" className="add-more" onClick={open}><FilePlus2 size={15} /> Tambah file lain</button>
          </div>}

          {error && <div className="feedback error-feedback" role="alert"><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="Tutup pesan"><X size={16} /></button></div>}
          {notice && <div className="feedback success-feedback" role="status"><Check size={16} /><span>{notice}</span></div>}

          <button type="button" className="primary-action" onClick={processPdf} disabled={busy || !files.length}>
            {busy ? <><LoaderCircle size={18} className="spin" /> Sedang memproses...</> : <><Download size={18} /> {tool === "merge" ? "Gabungkan & unduh" : tool === "extract" ? "Ekstrak & unduh" : tool === "rotate" ? "Putar & unduh" : "Kompres & unduh"} <ArrowRight size={17} /></>}
          </button>
          <div className="editor-footnote"><ShieldCheck size={14} /> Aman dan privat <span>·</span> Hasil langsung diunduh ke perangkat</div>
        </div>
      </section>

      <section className="feature-strip" aria-label="Fitur PDFCraft"><div><Files size={17} /><span>4 alat PDF praktis</span></div><div><ShieldCheck size={17} /><span>Tanpa unggah file</span></div><div><FileStack size={17} /><span>Gratis digunakan</span></div></section>
    </main>
  );
}
