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
            className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline dark:hover:text-white"
            title={String((currentYear ?? 0) - 1)}
            onClick={(() => updateYear(currentYear - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="font-bold hover:bg-transparent mx-4 dark:hover:text-white">
            {currentYear}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline dark:hover:text-white"
            title={String((currentYear ?? 0) + 1)}
            onClick={() => updateYear(currentYear + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
