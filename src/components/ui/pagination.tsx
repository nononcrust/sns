"use client";

import { createContextFactory } from "@/lib/context";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

interface PaginationProps {
  className?: string;
  page: number;
  onChange: (page: number) => void;
  total: number;
}

export const Pagination = ({ className, page, onChange, total }: PaginationProps) => {
  const currentPage = page;

  const totalPage = Math.ceil(total / 10);

  const renderPages = () => {
    if (totalPage <= 10) {
      return Array(totalPage)
        .fill(0)
        .map((_, index) => <PaginationItem key={index} page={index + 1} />);
    }

    if (page <= 5) {
      return (
        <>
          <PaginationItem page={1} />
          <PaginationItem page={2} />
          <PaginationItem page={3} />
          <PaginationItem page={4} />
          <PaginationItem page={5} />
          <PaginationItem page={6} />
          <PaginationEllipsis />
          <PaginationItem page={totalPage - 1} />
          <PaginationItem page={totalPage} />
        </>
      );
    }

    if (page >= 6 && page <= totalPage - 5) {
      return (
        <>
          <PaginationItem page={1} />
          <PaginationItem page={2} />
          <PaginationEllipsis />
          <PaginationItem page={currentPage - 1} />
          <PaginationItem page={currentPage} />
          <PaginationItem page={currentPage + 1} />
          <PaginationEllipsis />

          <PaginationItem page={totalPage - 1} />
          <PaginationItem page={totalPage} />
        </>
      );
    }

    return (
      <>
        <PaginationItem page={1} />
        <PaginationItem page={2} />
        <PaginationEllipsis />
        <PaginationItem page={totalPage - 5} />
        <PaginationItem page={totalPage - 4} />
        <PaginationItem page={totalPage - 3} />
        <PaginationItem page={totalPage - 2} />
        <PaginationItem page={totalPage - 1} />
        <PaginationItem page={totalPage} />
      </>
    );
  };

  return (
    <PaginationContext.Provider value={{ page, onChange }}>
      <nav className={cn("flex items-center gap-1", className)}>
        <PaginationButton
          aria-label="처음 페이지로 이동"
          onClick={() => onChange(1)}
          disabled={page === 1}
        >
          <ChevronsLeftIcon className="size-4" />
        </PaginationButton>
        <PaginationButton
          aria-label="이전 페이지로 이동"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeftIcon className="size-4" />
        </PaginationButton>
        {renderPages()}
        <PaginationButton
          className="size-7"
          aria-label="다음 페이지로 이동"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPage}
        >
          <ChevronRightIcon className="size-4" />
        </PaginationButton>
        <PaginationButton
          className="size-7"
          aria-label="마지막 페이지로 이동"
          onClick={() => onChange(total)}
          disabled={page === totalPage}
        >
          <ChevronsRightIcon className="size-4" />
        </PaginationButton>
      </nav>
    </PaginationContext.Provider>
  );
};

interface PaginationItemProps {
  page: number;
}

const PaginationItem = ({ page }: PaginationItemProps) => {
  const { page: currentPage, onChange } = usePaginationContext();

  const isActive = page === currentPage;

  const onClick = () => {
    onChange(page);
  };

  return (
    <PaginationButton
      className={cn(isActive && "pointer-events-none bg-primary text-white")}
      onClick={onClick}
      title={isActive ? "선택됨" : ""}
    >
      {page}
    </PaginationButton>
  );
};

const PaginationEllipsis = () => {
  return <span className="flex size-7 items-center justify-center text-[13px]">...</span>;
};

type PaginationContextValue = {
  page: number;
  onChange: (page: number) => void;
};

const [PaginationContext, usePaginationContext] =
  createContextFactory<PaginationContextValue>("Pagination");

interface PaginationButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const PaginationButton = ({ className, children, ...props }: PaginationButtonProps) => {
  return (
    <button
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border border-border text-[13px] font-medium transition-colors hover:bg-hover",
        "disabled:cursor-default disabled:select-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
