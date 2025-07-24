// utils.ts
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export const Pagination = ({
  currentPage,
  setPage,
  maxPage,
  onPageChange,
}: {
  currentPage: number;
  setPage: (page: number) => void;
  maxPage: number;
  onPageChange?: (page: number) => void;
}) => {
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= maxPage) {
      setPage(newPage); // update state
      if (onPageChange) onPageChange(newPage); // callback with new page
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ArrowLeft />
      </Button>

      <Button variant="outline" className="font-bold" disabled>
        <ArrowRight className="invisible w-[1px] max-w-[0.1px]" />
        {currentPage}
        <ArrowRight className="invisible w-[1px] max-w-[0.1px]" />
      </Button>

      <Button
        variant="outline"
        disabled={currentPage >= maxPage}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};
