/**
 * Direção visual: Arquivo de Serviço Público — ações sólidas, contraste documental e resposta tátil breve.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-sm text-sm font-semibold tracking-[-0.01em] transition-[transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--shadow)] hover:bg-[var(--accent-strong)]",
        outline: "border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
        ghost: "text-[var(--accent)] hover:bg-[var(--accent-soft)]",
      },
      size: {
        default: "min-h-11 px-4",
        sm: "min-h-10 px-3 text-xs",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
