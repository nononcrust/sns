"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <input
        className={cn(
          "h-8 w-full rounded-lg border border-content bg-content px-3 text-[13px] font-medium",
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
Input.displayName = "Input";
