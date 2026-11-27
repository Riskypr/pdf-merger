"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

// Lazily load pdfjs from the installed package or CDN fallback
let pdfjsLib: typeof import("pdfjs-dist") | null = null;
let pdfjsLoading: Promise<typeof import("pdfjs-dist")> | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  if (pdfjsLoading) return pdfjsLoading;
  pdfjsLoading = import("pdfjs-dist").then((mod) => {
    // Use bundled worker via CDN so we don't need to configure webpack
    const pdfjs = mod;
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    pdfjsLib = pdfjs;
    return pdfjs;
  });
  return pdfjsLoading;
}

interface PdfPageThumbProps {
  /** Shared ArrayBuffer of the PDF file (must NOT be detached) */
  pdfData: ArrayBuffer;
  /** 1-indexed page number */
  pageNumber: number;
  /** Rotation in degrees (0, 90, 180, 270) added on top of the page's own rotation */
  extraRotation?: number;
  /** Thumbnail width in CSS pixels (canvas will be rendered at 2× for retina) */
  width?: number;
}

export default function PdfPageThumb({
  pdfData,
  pageNumber,
  extraRotation = 0,
  width = 120,
}: PdfPageThumbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!pdfData || pdfData.byteLength === 0) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const pdfjs = await getPdfjs();
        // pdfjs detaches the given buffer, so we must copy it for each render
        const copy = pdfData.slice(0);
        const doc = await pdfjs.getDocument({ data: copy }).promise;
        if (cancelled) { doc.destroy(); return; }

        const page = await doc.getPage(pageNumber);
        if (cancelled) { doc.destroy(); return; }

        // Determine viewport at 2× density
        const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const baseVp = page.getViewport({ scale: 1 });
        const scale = (width / baseVp.width) * DPR;
        const viewport = page.getViewport({ scale, rotation: (baseVp.rotation + extraRotation) % 360 });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) { doc.destroy(); return; }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / DPR}px`;
        canvas.style.height = `${viewport.height / DPR}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) { doc.destroy(); return; }

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setLoading(false);

        page.cleanup();
        doc.destroy();
      } catch {
        if (!cancelled) {
          setLoading(false);
          setFailed(true);
        }
      }
    };

    void render();
    return () => { cancelled = true; };
  }, [pdfData, pageNumber, extraRotation, width]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-slate-100" style={{ width }}>
      {loading && !failed && (
        <div
          className="flex items-center justify-center rounded-lg bg-slate-100"
          style={{ width, height: Math.round(width * 1.414) }}
        >
          <LoaderCircle size={18} className="animate-spin text-slate-400" />
        </div>
      )}
      {failed && (
        <div
          className="flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-100 text-[10px] text-slate-400"
          style={{ width, height: Math.round(width * 1.414) }}
        >
          <span className="text-lg">📄</span>
          <span>Hal. {pageNumber}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`block rounded-lg shadow-xs transition-opacity duration-200 ${loading || failed ? "hidden" : "opacity-100"}`}
      />
    </div>
  );
}
