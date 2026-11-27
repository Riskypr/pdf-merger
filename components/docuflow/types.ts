export type ViewMode = "home" | "merge" | "compress" | "extract-rotate";

export type CompressionLevel = "max" | "recommended" | "light";

export interface PdfQueueItem {
  id: string;
  file: File;
  pageCount: number | null;
}

export interface HistoryItem {
  id: string;
  name: string;
  sizeLabel: string;
  actionLabel: "Digabung" | "Dikompres" | "Diekstrak" | "Diputar";
  timestampLabel: string;
  savedBytes?: number;
}

export interface ProcessedResult {
  id: string;
  fileName: string;
  badgeLabel: string;
  actionLabel: HistoryItem["actionLabel"];
  blob: Blob;
  pdfBuffer?: ArrayBuffer;
  pageCount?: number;
  originalSize?: number;
  zipEntries?: { name: string; size: number }[];
  sourceView: Exclude<ViewMode, "home">;
}
