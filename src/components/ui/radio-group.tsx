"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import React, { useId } from "react";

interface RadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>,
    "onChange" | "onValueChange"
  > {
  onChange: (value: string) => void;
}

const RadioGroupImpl = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  RadioGroupProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Root
      className={cn("flex flex-col gap-2", className)}
      onValueChange={onChange}
      {...props}
      ref={ref}
    />
  );
});
RadioGroupImpl.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, children, ...props }, ref) => {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <RadioGroupPrimitives.Item
        id={id}
        ref={ref}
        className={cn(
          "group flex h-5 w-5 items-center justify-center !ring-0",
          "disabled:cursor-default disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-3.5 w-3.5 rounded-full border",
            "group-focus:outline-none group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
            "group-data-[state=checked]:border-primary-dark",
          )}
        >
          <RadioGroupPrimitives.Indicator className="flex h-full w-full items-center justify-center rounded-full bg-primary">
            <CircleIcon className="h-1.5 w-1.5 fill-white text-white" />
          </RadioGroupPrimitives.Indicator>
        </div>
      </RadioGroupPrimitives.Item>
      <Label htmlFor={id}>{children}</Label>
    </div>
  );
});
RadioGroupItem.displayName = "RadioGroup.Item";

export const RadioGroup = Object.assign(RadioGroupImpl, {
  Item: RadioGroupItem,
});
