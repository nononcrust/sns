import { cn } from "@/lib/utils";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import React from "react";

const DEFAULT_POPOVER_CONTENT_SIDE = "bottom";
const DEFAULT_POPOVER_CONTENT_ALIGN = "start";
const DEFAULT_POPOVER_CONTENT_SIDE_OFFSET = 8;

type PopoverContentSide = "top" | "right" | "bottom" | "left";
type PopoverContentAlign = "start" | "center" | "end";

interface PopoverProps extends Omit<PopoverPrimitives.PopoverProps, "open"> {
  isOpen?: boolean;
  modal?: boolean;
}

const PopoverImpl = ({ isOpen, modal, children, ...props }: PopoverProps) => {
  return (
    <PopoverPrimitives.Root open={isOpen} modal={modal} {...props}>
      {children}
    </PopoverPrimitives.Root>
  );
};

interface PopoverTriggerProps extends PopoverPrimitives.PopoverTriggerProps {}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Trigger>,
  PopoverTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <PopoverPrimitives.Trigger ref={ref} {...props}>
      {children}
    </PopoverPrimitives.Trigger>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps extends PopoverPrimitives.PopoverContentProps {
  align?: PopoverContentAlign;
  side?: PopoverContentSide;
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      align = DEFAULT_POPOVER_CONTENT_ALIGN,
      side = DEFAULT_POPOVER_CONTENT_SIDE,
      sideOffset = DEFAULT_POPOVER_CONTENT_SIDE_OFFSET,
      ...props
    },
    ref,
  ) => {
    return (
      <PopoverPrimitives.Portal>
        <PopoverPrimitives.Content
          className={cn(
            "bg-popover flex flex-col rounded-md border border-border p-3 shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          collisionPadding={20}
          sideOffset={sideOffset}
          ref={ref}
          side={side}
          align={align}
          {...props}
        >
          {children}
        </PopoverPrimitives.Content>
      </PopoverPrimitives.Portal>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

export const Popover = Object.assign(PopoverImpl, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverPrimitives.Close,
});
