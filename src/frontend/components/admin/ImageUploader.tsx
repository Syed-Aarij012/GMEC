"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Loader2, ImageOff, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? `Could not upload ${file.name}`);
          continue;
        }
        uploaded.push(data.url);
      } catch {
        setError(`Could not upload ${file.name}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
    }
    setUploading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function setAsMain(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [img] = next.splice(index, 1);
    next.unshift(img);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-gold-500 bg-gold-500/5"
            : "border-line/20 hover:border-gold-500/60 hover:bg-canvas-muted"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-gold-600" />
        ) : (
          <UploadCloud className="h-7 w-7 text-text/40" />
        )}
        <p className="text-sm font-medium text-text">
          {uploading ? "Uploading..." : "Click to upload or drag images here"}
        </p>
        <p className="text-xs text-text/50">JPEG, PNG, WebP or GIF, up to 5MB each</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-canvas-muted"
              >
                <Image src={img} alt={`Product image ${i + 1}`} fill sizes="120px" className="object-cover" />

                <div className="absolute inset-x-1 top-1 flex items-start justify-between">
                  {i === 0 ? (
                    <span className="rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Main
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAsMain(i)}
                      aria-label="Set as main image"
                      title="Set as main image"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/70 text-white opacity-0 transition-opacity hover:bg-gold-600 group-hover:opacity-100"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    aria-label="Remove image"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/70 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="absolute inset-x-1 bottom-1 flex justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    aria-label="Move image earlier"
                    title="Move earlier"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/70 text-white disabled:pointer-events-none disabled:opacity-30 hover:bg-gold-600"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label="Move image later"
                    title="Move later"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/70 text-white disabled:pointer-events-none disabled:opacity-30 hover:bg-gold-600"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-text/40">
          <ImageOff className="h-4 w-4" />
          No images yet, a placeholder will be used until you add one.
        </div>
      )}
    </div>
  );
}
