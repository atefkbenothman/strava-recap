import { useCurrentYearContext } from "../../hooks/useCurrentYearContext"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

export default function YearPicker() {
  const { currentYear, updateYear } = useCurrentYearContext()

  return (
    <Pagination className="h-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="flex items-center justify-center text-xs hover:bg-transparent p-0 hover:cursor-pointer hover:underline dark:hover:text-white"
            title={String((currentYear ?? 0) - 1)}
            onClick={(() => updateYear(currentYear - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="flex text-center text-md justify-center font-bold hover:bg-transparent mx-4 dark:hover:text-white">
            {currentYear}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="flex items-center justify-center text-xs hover:bg-transparent p-0 hover:cursor-pointer hover:underline dark:hover:text-white"
            title={String((currentYear ?? 0) + 1)}
            onClick={() => updateYear(currentYear + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
