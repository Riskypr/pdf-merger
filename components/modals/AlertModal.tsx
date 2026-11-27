"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertModal({ isOpen, onClose }: AlertModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">File Tidak Cukup</h3>
            <p className="mb-8 text-sm text-gray-500 leading-relaxed">
              Silakan pilih minimal <strong>2 file PDF</strong> untuk digabungkan menjadi satu dokumen.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-gray-900 py-3.5 font-bold text-white transition-all hover:bg-gray-800 active:scale-95 cursor-pointer"
            >
              Siap, Mengerti!
            </button>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}