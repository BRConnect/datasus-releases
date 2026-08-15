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
        default: "border-[#0a5b4a]/20 bg-[#0a5b4a]/8 text-[#0a5b4a]",
        accent: "border-[#c86b42]/25 bg-[#c86b42]/10 text-[#a34e29]",
        neutral: "border-[#1c2724]/10 bg-[#1c2724]/[0.04] text-[#58605b]",
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
