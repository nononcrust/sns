import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const iconButtonVariants = cva(
  cn(
    "flex size-8 items-center justify-center rounded-lg border transition-colors border-border",
    "disabled:cursor-default disabled:select-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        outlined: "hover:bg-hover bg-transparent",
        ghost: "hover:bg-hover border-transparent",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  },
);

interface IconButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, children, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component className={cn(iconButtonVariants({ className, variant }))} ref={ref} {...props}>
        <Slot className="size-4">{children}</Slot>
      </Component>
    );
  },
);
IconButton.displayName = "IconButton";
