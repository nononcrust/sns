import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  cn(
    "flex items-center justify-center rounded-lg font-semibold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark",
        outlined: "border hover:bg-gray-50",
        ghost: "hover:bg-gray-50",
        error: "",
      },
      size: {
        small: "h-7 text-[12px] px-2",
        medium: "h-8 text-[13px] px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, disabled = false, type = "button", children, asChild = false, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Button.displayName = "Button";
