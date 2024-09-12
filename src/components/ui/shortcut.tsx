import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

interface ShortcutProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
}

export const Shortcut = React.forwardRef<HTMLDivElement, ShortcutProps>(
  ({ className, children, label, ...props }, ref) => {
    return (
      <div
        className={cn("flex items-center justify-center gap-2 text-subtle", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-6 items-center justify-center rounded-md border border-border bg-content px-1">
          <Slot className="flex size-4 items-center justify-center text-[11px] font-medium text-main">
            {children}
          </Slot>
        </div>
        <span className="text-[13px] font-medium text-sub">{label}</span>
      </div>
    );
  },
);
Shortcut.displayName = "Shortcut";
