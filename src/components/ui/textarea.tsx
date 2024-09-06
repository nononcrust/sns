"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-8 w-full rounded-lg border border-content bg-content px-3 py-1.5 text-[13px] font-medium",
          "focus-visible:outline-none",
          className,
          error && "border-error",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
