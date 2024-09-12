"use client";

import { createContextFactory } from "@/lib/context";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { IconButton } from "./icon-button";

interface PaginationProps {
  className?: string;
  page: number;
  onChange: (page: number) => void;
  total: number;
}

export const Pagination = ({ className, page, onChange, total }: PaginationProps) => {
  const currentPage = page;

  const renderPages = () => {
    if (total <= 10) {
      return Array(total)
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
          <PaginationItem page={total - 1} />
          <PaginationItem page={total} />
        </>
      );
    }

    if (page >= 6 && page <= total - 5) {
      return (
        <>
          <PaginationItem page={1} />
          <PaginationItem page={2} />
          <PaginationEllipsis />
          <PaginationItem page={currentPage - 1} />
          <PaginationItem page={currentPage} />
          <PaginationItem page={currentPage + 1} />
          <PaginationEllipsis />

          <PaginationItem page={total - 1} />
          <PaginationItem page={total} />
        </>
      );
    }

    return (
      <>
        <PaginationItem page={1} />
        <PaginationItem page={2} />
        <PaginationEllipsis />
        <PaginationItem page={total - 5} />
        <PaginationItem page={total - 4} />
        <PaginationItem page={total - 3} />
        <PaginationItem page={total - 2} />
        <PaginationItem page={total - 1} />
        <PaginationItem page={total} />
      </>
    );
  };

  return (
    <PaginationContext.Provider value={{ page, onChange }}>
      <nav className={cn("flex items-center gap-1", className)}>
        <IconButton
          className="size-7"
          aria-label="처음 페이지로 이동"
          onClick={() => onChange(1)}
          disabled={page === 1}
        >
          <ChevronsLeftIcon />
        </IconButton>
        <IconButton
          className="size-7"
          aria-label="이전 페이지로 이동"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeftIcon />
        </IconButton>
        {renderPages()}
        <IconButton
          className="size-7"
          aria-label="다음 페이지로 이동"
          onClick={() => onChange(page + 1)}
          disabled={page === total}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          className="size-7"
          aria-label="마지막 페이지로 이동"
          onClick={() => onChange(total)}
          disabled={page === total}
        >
          <ChevronsRightIcon />
        </IconButton>
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
    <IconButton
      className={cn("size-7", isActive && "")}
      onClick={onClick}
      title={isActive ? "선택됨" : ""}
    >
      {page}
    </IconButton>
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
        "hover:bg-hover flex size-8 items-center justify-center rounded-lg border border-border transition-colors",
        "disabled:cursor-default disabled:select-none disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
};
