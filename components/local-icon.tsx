/**
 * Direção visual: Arquivo de Serviço Público — ícones locais, vetoriais e sem dependências externas.
 */
import type { ImgHTMLAttributes } from "react";

export type LocalIconName =
  | "archive"
  | "arrow-up-right"
  | "check"
  | "clock"
  | "database"
  | "download"
  | "external"
  | "file"
  | "github"
  | "refresh"
  | "verified";

type LocalIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  name: LocalIconName;
};

export function LocalIcon({ name, alt = "", className, ...props }: LocalIconProps) {
  return (
    <img
      src={`/assets/icons/${name}.svg`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      width="24"
      height="24"
      {...props}
    />
  );
}
