interface BadgeProps {
  count?: number;
  children: React.ReactNode;
}

export const Badge = ({ children, count }: BadgeProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {children}
      {count && (
        <span className="absolute right-[-2px] top-[-2px] flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[12px] font-medium text-white">
          {count}
        </span>
      )}
      {!count && (
        <span className="border-background absolute right-0 top-[-2px] h-3.5 w-3.5 rounded-full border-[3px] bg-main" />
      )}
    </div>
  );
};
