"use client";

import { createContext, useContext, useState } from "react";
import type { ProcessedResult, ViewMode } from "./types";

interface NavigationContextValue {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  previewResult: ProcessedResult | null;
  setPreviewResult: (result: ProcessedResult | null) => void;
  navigateToView: (nextView: ViewMode) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewMode>("home");
  const [previewResult, setPreviewResult] = useState<ProcessedResult | null>(null);

  const navigateToView = (nextView: ViewMode) => {
    setPreviewResult(null);
    setView(nextView);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <NavigationContext.Provider
      value={{ view, setView, previewResult, setPreviewResult, navigateToView }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useDocuFlowNav() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useDocuFlowNav must be used inside NavigationProvider");
  }
  return ctx;
}
