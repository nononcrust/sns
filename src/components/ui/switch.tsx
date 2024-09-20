"use client";

import { cn } from "@/lib/utils";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import React from "react";

interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    "onChange" | "onCheckedChange"
  > {
  onChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, onChange, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 !border-transparent transition-colors",
        "disabled:cursor-default disabled:opacity-50",
        "data-[state=unchecked]:bg-switch",
        "!data-[state=checked] border-primary data-[state=checked]:bg-blue-500",
        className,
      )}
      onCheckedChange={onChange}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
          "data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:translate-x-4",
        )}
      />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;
