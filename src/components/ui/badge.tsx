import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-7 items-center rounded-lg px-2.5 text-xs font-bold uppercase",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700",
        open: "bg-emerald-100 text-emerald-800",
        upcoming: "bg-amber-100 text-amber-900",
        closed: "bg-slate-200 text-slate-600",
        info: "bg-cyan-50 text-cyan-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}
