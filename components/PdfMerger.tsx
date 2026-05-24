"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { FileText, GripVertical, Trash2, Download, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mergeAllPdfs } from "@/lib/pdf-helper";
import AlertModal from "@/components/modals/AlertModal"; 

export default function PdfMerger() {
    const [files, setFiles] = useState<File[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
    });

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFiles(items);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setShowModal(true);
            return;
        }

        const mergedBytes = await mergeAllPdfs(files);
        const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "merged-document.pdf";
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!isReady) return null;

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-12 relative">
            <AlertModal isOpen={showModal} onClose={() => setShowModal(false)} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance">
                    Gabungkan PDF dalam <span className="text-emerald-400">Hitungan Detik</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Alat pengolah dokumen yang aman. File Anda tidak akan pernah meninggalkan perangkat Anda.
                </p>
            </motion.div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl shadow-emerald-100">
                <div
                    {...getRootProps()}
                    className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer ${
                        isDragActive ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                            <UploadCloud className="h-8 w-8 text-emerald-400" />
                        </div>
                        <p className="mb-2 text-xl font-bold text-gray-900">Pilih atau Tarik File</p>
                        <p className="text-gray-500 text-sm">Maksimal 20 file per penggabungan</p>
                    </div>
                </div>

                <AnimatePresence>
                    {files.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Urutan Dokumen ({files.length})</h3>
                                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                                    Tarik untuk mengatur
                                </span>
                            </div>

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="pdf-list">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {files.map((file, index) => (
                                                <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                                                    {(provided, snapshot) => (
                                                        /* Ganti motion.div dengan div biasa di dalam Draggable */
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`flex items-center rounded-xl border p-4 transition-shadow ${
                                                                snapshot.isDragging 
                                                                ? "border-emerald-400 bg-emerald-50 shadow-xl ring-2 ring-emerald-200 z-50" 
                                                                : "border-gray-100 bg-white"
                                                            }`}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                // Menghindari glitch posisi saat drag
                                                                cursor: snapshot.isDragging ? "grabbing" : "default"
                                                            }}
                                                        >
                                                            <div {...provided.dragHandleProps} className="mr-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                                                <GripVertical size={20} />
                                                            </div>
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 mr-4">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="truncate font-semibold text-gray-900 text-sm">{file.name}</p>
                                                                <p className="text-[10px] text-gray-400 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleMerge}
                                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-200/50 transition-all hover:bg-emerald-500 cursor-pointer"
                            >
                                <Download size={24} />
                                Gabungkan Sekarang
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}