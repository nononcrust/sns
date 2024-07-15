import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex size-8 items-center justify-center rounded-lg border transition-colors hover:bg-gray-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        <Slot className="size-4">{children}</Slot>
      </button>
    );
  },
);
IconButton.displayName = "IconButton";
