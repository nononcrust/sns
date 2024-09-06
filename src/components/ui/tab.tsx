import { createContextFactory } from "@/lib/context";
import { cn } from "@/lib/utils";
import React, { useId } from "react";

type TabContextValue = {
  value: string;
  onChange: (value: string) => void;
  id: string;
};

const [TabContext, useTabContext] = createContextFactory<TabContextValue>("Tab");

interface TabRootProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const triggerId = (id: string, value: string) => `${id}-tab-trigger-${value}`;
const contentId = (id: string, value: string) => `${id}-tab-content-${value}`;

const TabRoot = ({ children, value, onChange }: TabRootProps) => {
  const id = useId();

  return <TabContext.Provider value={{ value, onChange, id }}>{children}</TabContext.Provider>;
};

const TabList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("flex border-b border-border", className)}
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabList.displayName = "TabList";

interface TabItemProps extends React.ComponentPropsWithoutRef<"button"> {
  value: string;
}

const TabItem = React.forwardRef<React.ElementRef<"button">, TabItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: currentValue, onChange, id } = useTabContext();

    const isActive = value === currentValue;

    const onClick = () => {
      onChange(value);
    };

    return (
      <button
        className={cn(
          "flex h-12 flex-1 items-center justify-center border-b-2 border-transparent text-[15px] font-semibold text-sub",
          isActive && "border-main text-main",
          className,
        )}
        onClick={onClick}
        role="tab"
        id={triggerId(id, value)}
        aria-selected={isActive}
        aria-controls={contentId(id, value)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabItem.displayName = "TabItem";

interface TabContentProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: currentValue, id } = useTabContext();

    const isActive = value === currentValue;

    if (!isActive) {
      return null;
    }

    return (
      <div
        className={cn("", className)}
        ref={ref}
        role="tabpanel"
        id={contentId(id, value)}
        aria-labelledby={triggerId(id, value)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabContent.displayName = "TabContent";

export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Item: TabItem,
  Content: TabContent,
});
