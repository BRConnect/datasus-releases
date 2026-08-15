/**
 * Direção visual: Arquivo de Serviço Público — etiquetas compactas como marcações de acervo.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "border-[var(--accent)]/25 bg-[var(--accent-soft)] text-[var(--accent)]",
        accent: "border-[var(--coral)]/30 bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] text-[var(--coral)]",
        neutral: "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
