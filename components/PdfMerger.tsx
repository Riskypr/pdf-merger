"use client";

import { useState } from "react";
import { FoldVertical, LayoutGrid, Merge, RefreshCw } from "lucide-react";
import { formatFileSize } from "@/lib/pdf-utils";
import HomeView from "./docuflow/HomeView";
import MergeView from "./docuflow/MergeView";
import CompressView from "./docuflow/CompressView";
import ExtractRotateView from "./docuflow/ExtractRotateView";
import ResultPreviewView from "./docuflow/ResultPreviewView";
import { useDocuFlowNav } from "./docuflow/NavigationContext";
import type { HistoryItem, ProcessedResult, ViewMode } from "./docuflow/types";

const NAV_TABS: { id: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: "home", label: "Beranda", icon: LayoutGrid },
  { id: "merge", label: "Gabung", icon: Merge },
  { id: "compress", label: "Kompres", icon: FoldVertical },
  { id: "extract-rotate", label: "Ekstrak & Putar", icon: RefreshCw },
];

export default function PdfMerger() {
  const { view, setView, previewResult, setPreviewResult, navigateToView } = useDocuFlowNav();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [quickMergeFiles, setQuickMergeFiles] = useState<File[]>([]);
  const [quickCompressFile, setQuickCompressFile] = useState<File | null>(null);
  const [quickExtractFile, setQuickExtractFile] = useState<File | null>(null);
  const [quickDropSeed, setQuickDropSeed] = useState(0);

  const totalSavedBytes = history.reduce((sum, item) => sum + (item.savedBytes ?? 0), 0);

  const handlePreview = (result: ProcessedResult) => {
    const savedBytes =
      result.originalSize && result.originalSize > result.blob.size
        ? result.originalSize - result.blob.size
        : 0;
    setHistory((prev) =>
      [
        {
          id: result.id,
          name: result.fileName,
          sizeLabel: formatFileSize(result.blob.size),
          actionLabel: result.actionLabel,
          timestampLabel: "Baru saja",
          savedBytes,
        },
        ...prev,
      ].slice(0, 12),
    );
    setPreviewResult(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickFiles = (files: File[]) => {
    const first = files[0];
    if (!first) return;
    setQuickDropSeed((s) => s + 1);
    if (first.type.startsWith("image/")) {
      setQuickCompressFile(first);
      navigateToView("compress");
    } else if (files.length > 1) {
      setQuickMergeFiles(files);
      navigateToView("merge");
    } else {
      setQuickExtractFile(first);
      navigateToView("extract-rotate");
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-5 pb-24 sm:px-6 sm:py-7 md:pb-12">
      <div
        key={previewResult ? `preview-${previewResult.id}` : view}
        className="animate-view-enter"
      >
        {previewResult ? (
          <ResultPreviewView
            result={previewResult}
            onBackToTool={() => {
              setView(previewResult.sourceView);
              setPreviewResult(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onReset={() => {
              setPreviewResult(null);
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <>
            {view === "home" && (
              <HomeView
                history={history}
                totalSavedBytes={totalSavedBytes}
                onNavigate={navigateToView}
                onQuickFiles={handleQuickFiles}
              />
            )}

            {view === "merge" && (
              <MergeView
                key={`merge-${quickDropSeed}`}
                initialFiles={quickMergeFiles}
                onPreview={handlePreview}
              />
            )}

            {view === "compress" && (
              <CompressView
                key={`compress-${quickDropSeed}`}
                initialFile={quickCompressFile}
                onPreview={handlePreview}
              />
            )}

            {view === "extract-rotate" && (
              <ExtractRotateView
                key={`extract-${quickDropSeed}`}
                initialFile={quickExtractFile}
                onPreview={handlePreview}
              />
            )}
          </>
        )}
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <nav
        aria-label="Navigasi bawah DocuFlow"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-md md:hidden"
      >
        <div className="mx-auto flex w-full max-w-2xl items-center justify-around gap-1 px-1.5 pt-1 pb-[max(0.45rem,env(safe-area-inset-bottom))]">
          {NAV_TABS.map(({ id, label, icon: Icon }) => {
            const active = !previewResult && view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateToView(id)}
                className={`flex shrink-0 flex-col items-center justify-center gap-0.5 px-1 py-0.5 text-[7.5px] leading-none tracking-tight transition-colors ${
                  active
                    ? "font-bold text-[#B91C1C]"
                    : "font-semibold text-[#475569] hover:text-slate-900"
                }`}
              >
                <span
                  className={`grid h-6 w-9 place-items-center rounded-full transition-colors ${
                    active ? "bg-[#FDE8EA] text-[#B91C1C]" : "text-[#475569]"
                  }`}
                >
                  <Icon size={12} strokeWidth={active ? 2.2 : 1.9} />
                </span>
                <span className="whitespace-nowrap text-center">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
