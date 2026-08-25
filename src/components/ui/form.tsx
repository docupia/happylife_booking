import * as React from "react";

import { cn } from "@/lib/utils";

export const inputClassName =
  "h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/15";

export const textareaClassName =
  "min-h-24 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/15";

export function Field({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field"
      className={cn("grid gap-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(inputClassName, className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaClassName, className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(inputClassName, className)}
      {...props}
    />
  );
}
