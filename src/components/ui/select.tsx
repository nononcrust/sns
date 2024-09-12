import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {}

const SelectImpl = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center rounded-lg border border-border", className)}>
        <select
          className={cn(
            "hover:bg-hover h-8 cursor-pointer appearance-none rounded-lg bg-transparent px-3 pr-7 text-[13px] font-medium transition-colors",
            "focus-visible:focus-ring",
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 size-4 -translate-y-1/2" />
      </div>
    );
  },
);
SelectImpl.displayName = "Select";

interface SelectItemProps extends React.ComponentPropsWithoutRef<"option"> {}

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option className={cn("", className)} ref={ref} {...props}>
        {children}
      </option>
    );
  },
);
SelectItem.displayName = "SelectItem";

export const Select = Object.assign(SelectImpl, {
  Item: SelectItem,
});
