import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachinePhotoProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Pásalo en la primera foto visible de cada lista para evitar el warning de LCP. */
  priority?: boolean;
}

/** Foto de la máquina, con el mismo placeholder de trama diagonal que el resto del sistema. */
export function MachinePhoto({ src, alt, className, priority = false }: MachinePhotoProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "doc-hatch flex shrink-0 items-center justify-center border border-ink",
          className
        )}
      >
        <Camera className="h-5 w-5 text-ink/35" strokeWidth={1.6} />
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0 overflow-hidden border border-ink", className)}>
       
    </div>
  );
}
