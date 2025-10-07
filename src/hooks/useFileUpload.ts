import { FileData } from "@/types/loi";
import { useRef, useState } from "react";

export function useFileUpload() {
  const [fileUpload, setUploadedFile] = useState<FileData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pick = (file?: File) => {
    if (!file) return;
    const sizeKB = file.size / 1024;
    setUploadedFile({
      name: file.name,
      size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB.toFixed(2)} KB`,
      type: file.type,
      file,
    });
  };

  const drag = {
    onEnter: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); },
    onOver:  (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); },
    onLeave: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); },
    onDrop:  (e: React.DragEvent) => {
      e.preventDefault(); e.stopPropagation(); setDragActive(false);
      const f = e.dataTransfer.files?.[0]; if (f) pick(f);
    },
  };

  return { fileUpload, setUploadedFile, dragActive, uploading, setUploading, progress, setProgress, fileInputRef, pick, drag };
}
