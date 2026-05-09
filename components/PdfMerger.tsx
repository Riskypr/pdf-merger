"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { FileText, GripVertical, Trash2, Download, UploadCloud } from "lucide-react";
import { mergeAllPdfs } from "@/lib/pdf-helper";



export default function PdfMerger() {
    const [files, setFiles] = useState<File[]>([]);
    const [isReady, setIsReady] = useState(false);

    // Mencegah Hydration Error pada Next.js
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
        if (files.length < 2) return alert("Minimal pilih 2 file!");

        const mergedBytes = await mergeAllPdfs(files);

        // Tambahkan 'as ArrayBuffer' pada properti .buffer
        const blob = new Blob([mergedBytes.buffer as ArrayBuffer], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "merged-document.pdf";
        link.click();

        // Clean up URL object untuk menghemat memori
        URL.revokeObjectURL(url);
    };

    if (!isReady) return null;

    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            {/* Hero Header */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Gabungkan PDF dalam <span className="text-indigo-600">Hitungan Detik</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Alat pengolah dokumen yang aman. File Anda tidak akan pernah meninggalkan perangkat Anda karena semua proses dilakukan langsung di browser.
                </p>
            </div>

            {/* Main Container */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl shadow-indigo-100">
                <div
                    {...getRootProps()}
                    className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 transition-all ${isDragActive
                            ? "border-indigo-400 bg-indigo-50/50"
                            : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                            <UploadCloud className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="mb-2 text-xl font-bold text-gray-900">Pilih atau Tarik File</p>
                        <p className="text-gray-500 text-sm">Maksimal 20 file per penggabungan</p>
                    </div>
                </div>

                {/* List Section */}
                {files.length > 0 && (
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Urutan Dokumen ({files.length})</h3>
                            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Tarik untuk mengubah urutan</p>
                        </div>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="pdf-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        {files.map((file, index) => (
                                            <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`flex items-center rounded-xl border p-4 transition-all ${snapshot.isDragging
                                                                ? "border-indigo-500 bg-indigo-50 shadow-lg"
                                                                : "border-gray-100 bg-white hover:border-gray-300"
                                                            }`}
                                                    >
                                                        <div {...provided.dragHandleProps} className="mr-4 text-gray-300 hover:text-gray-600">
                                                            <GripVertical size={20} />
                                                        </div>
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 mr-4">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate font-semibold text-gray-900">{file.name}</p>
                                                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(index)}
                                                            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
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

                        <button
                            onClick={handleMerge}
                            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98]"
                        >
                            <Download size={24} />
                            Gabungkan Sekarang
                        </button>
                    </div>
                )}
            </div>

            {/* Privacy Note */}
            <p className="mt-8 text-center text-sm text-gray-400">
                🔒 Keamanan terjamin: Pemrosesan 100% Client-Side.
            </p>
        </div>
    );
}