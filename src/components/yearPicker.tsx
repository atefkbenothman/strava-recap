import { useContext } from "react"
import { ActivityDataContext } from "../contexts/context"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

export default function YearPicker() {
  const { currentYear, updateYear } = useContext(ActivityDataContext)
  return (
    <Pagination className="h-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline"
            title={String((currentYear ?? 0) - 1)}
            onClick={(() => updateYear((currentYear ?? 0) - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="font-semibold hover:bg-transparent mx-4">
            {currentYear}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="hover:bg-transparent p-0 hover:cursor-pointer hover:underline"
            title={String((currentYear ?? 0) + 1)}
            onClick={() => updateYear((currentYear ?? 0) + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
