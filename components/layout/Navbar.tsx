"use client";

import { useState } from "react";
import { FileStack, ChevronDown, Combine, FileType, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-[80px] items-center justify-between px-4 sm:px-6">
                {/* Logo Section */}
                <a href="/">
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 group-hover:shadow-emerald-100 group-hover:border-emerald-100 transition-all">
                        <img src="/favicon.ico" alt="PDFCraft Logo" className="h-7 w-7" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        PDF<span className="text-emerald-500">Craft</span>
                    </span>
                </div>
                </a>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    {/* Dropdown Tools */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <button className={`flex items-center gap-1 transition-colors hover:text-emerald-500 py-4 cursor-pointer ${isToolsOpen ? 'text-emerald-500' : ''}`}>
                            Tools
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isToolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute left-1/2 mt-2 w-[400px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/50"
                                >
                                    <div className="grid grid-cols-1 gap-2">
                                          {/* Tool 1: Merge PDF */}
                                        <a
                                            href="/"
                                            onClick={() => setIsToolsOpen(false)} 
                                            className="group flex items-start gap-4 rounded-xl p-3 transition-all hover:bg-emerald-50 cursor-pointer active:scale-[0.98]"
                                        >
                                            <div className="group flex items-start gap-4 rounded-xl p-3 transition-all hover:bg-emerald-50/50 cursor-pointer">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                    <Combine size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900">Merge PDF</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Gabungkan banyak file PDF menjadi satu dokumen.</p>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Tool 2: PDF to DOCX */}
                                        <div className="group flex items-start gap-4 rounded-xl p-3 opacity-60 transition-all">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <FileType size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-gray-900">PDF to DOCX</p>
                                                    <div className="flex items-center gap-1 text-blue-600">
                                                        {/* <Sparkles size={12} className="fill-amber-500" /> */}
                                                        <span className="text-[10px] font-bold capitalize tracking-wider">Coming Soon</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">Konversi dokumen PDF ke format Word yang dapat diedit.</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="mt-4 border-t border-gray-50 pt-3 text-center">
                                        <p className="text-[11px] font-normal text-gray-400 italic">Lebih banyak alat AI akan segera hadir...</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <a href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy</a>
                    <a href="/about" className="hover:text-emerald-500 transition-colors">About</a>
                </div>

                {/* GitHub Section */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Riskypr/pdf-merger"
                        target="_blank"
                        className="group relative rounded-full p-2 text-gray-700 hover:bg-emerald-50 transition-all active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-7 h-7 transition-colors group-hover:text-emerald-600"
                        >
                            <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 008 10.94c.58.1.79-.25.79-.55v-2.15c-3.25.71-3.94-1.57-3.94-1.57-.53-1.34-1.3-1.7-1.3-1.7-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.76 1.28 3.43.98.1-.76.41-1.28.75-1.57-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.21-3.15-.12-.3-.52-1.5.11-3.13 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.63 1.63.23 2.83.11 3.13.75.82 1.21 1.87 1.21 3.15 0 4.51-2.74 5.5-5.35 5.8.42.36.8 1.08.8 2.18v3.23c0 .3.21.65.8.55A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    );
}