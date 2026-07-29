"use client";

import { useState, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileToResizedDataUrl } from "@/lib/excaval/image";
import { MachinePhoto } from "./machine-photo";

interface MachinePhotoUploadProps {
  src: string;
  alt: string;
  onUpload: (dataUrl: string) => void;
  /** Icono solo, sin label — para miniaturas chicas (tarjeta de escritorio). */
  compact?: boolean;
  /** Pásalo en la primera foto visible de cada lista para evitar el warning de LCP. */
  priority?: boolean;
  className?: string;
}

/** Foto de la máquina con control para subir/cambiarla — mismo gesto que el recibo de Salidas. */
export function MachinePhotoUpload({
  src,
  alt,
  onUpload,
  compact = false,
  priority = false,
  className,
}: MachinePhotoUploadProps) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLoading(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      onUpload(dataUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <MachinePhoto src={src} alt={alt} priority={priority} className="h-full w-full" />
      <label
        className={cn(
          "absolute right-1 bottom-1 flex items-center gap-1.5 border border-ink bg-paper font-heading text-xs font-semibold text-ink uppercase",
          compact ? "h-6 w-6 justify-center" : "min-h-9 px-2.5",
          loading ? "opacity-60" : "cursor-pointer"
        )}
        title="Cambiar foto"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
        ) : (
          <Camera className="h-3.5 w-3.5" strokeWidth={1.8} />
        )}
        {compact ? <span className="sr-only">Cambiar foto</span> : "Cambiar foto"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
          disabled={loading}
        />
      </label>
    </div>
  );
}
