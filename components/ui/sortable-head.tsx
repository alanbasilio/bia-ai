import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortState = { column: string; dir: "asc" | "desc" } | null;

interface SortableHeadProps {
  column: string;
  sort: SortState;
  onSort: (column: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function SortableHead({
  column,
  sort,
  onSort,
  className,
  children,
}: SortableHeadProps) {
  const isActive = sort?.column === column;

  return (
    <TableHead
      className={cn("cursor-pointer select-none whitespace-nowrap", className)}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {isActive && sort?.dir === "asc" ? (
          <ArrowUp className="size-3 shrink-0" />
        ) : isActive && sort?.dir === "desc" ? (
          <ArrowDown className="size-3 shrink-0" />
        ) : (
          <ArrowUpDown className="size-3 shrink-0 text-muted-foreground/40" />
        )}
      </div>
    </TableHead>
  );
}

export function useSort() {
  return {
    handleSort(
      prev: SortState,
      column: string
    ): SortState {
      if (prev?.column !== column) return { column, dir: "asc" };
      if (prev.dir === "asc") return { column, dir: "desc" };
      return null;
    },
  };
}
