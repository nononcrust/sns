import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface LinkTabRootProps extends React.ComponentPropsWithoutRef<"div"> {}

const LinkTabRoot = React.forwardRef<HTMLDivElement, LinkTabRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("flex", className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
LinkTabRoot.displayName = "LinkTab";

interface LinkTabItemProps extends React.ComponentPropsWithoutRef<typeof Link> {}

const LinkTabItem = React.forwardRef<React.ElementRef<typeof Link>, LinkTabItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Link className={cn("", className)} ref={ref} {...props}>
        {children}
      </Link>
    );
  },
);
LinkTabItem.displayName = "LinkTabItem";

export const LinkTab = Object.assign(LinkTabRoot, {
  Item: LinkTabItem,
});
