import { cn } from "@/lib/utils";

interface EmptyStateProps {
  className?: string;
  title?: string;
  description?: string;
}

export const EmptyState = ({ className, title, description }: EmptyStateProps) => {
  return (
    <div className={cn("flex w-full flex-col items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-1">
        {title && <p className="text-lg font-semibold text-main">{title}</p>}
        {description && <p className="text-subtle text-sm font-medium">{description}</p>}
      </div>
    </div>
  );
};
