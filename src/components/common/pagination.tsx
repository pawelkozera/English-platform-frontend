import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {(totalPages > 0 ? totalPages : 1)}
      </span>
      <Button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        variant="outline"
        size="sm"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}