import { SquareArrowOutUpRight } from "lucide-react"

type CardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
  total?: number
  totalUnits?: string
  icon?: React.ReactNode
  stravaLink?: string
}

export default function Card({ title, description, children, total, totalUnits, icon, stravaLink }: CardProps) {
  return (
    <div className="flex flex-col w-full h-full relative p-2">
      <div className="flex gap-4 pb-2">
        <div className="flex flex-col w-full gap-0.5">
          <div className="flex gap-2 items-center dark:text-white">
            {icon ? (
              icon
            ) : null}
            <p className="font-semibold text-sm dark:text-white">{title}</p>
          </div>
          <p className="text-[10px] font-normal text-black/75 pl-6 dark:text-white/75">{description}</p>
        </div>
        {total !== undefined ? (
          <div className="text-right">
            <p className="ml-auto font-bold text-xl bg-gray-300 dark:bg-[#2e3032] dark:text-white p-1 rounded w-fit">{total}</p>
            <p className="ml-auto text-[10px] p-1 dark:text-white">{totalUnits}</p>
          </div>
        ) : stravaLink ? (
          <div className="ml-auto text-right text-[10px]">
            <a href={stravaLink} target="_blank">
              <SquareArrowOutUpRight size={16} className="hover:cursor-pointer" />
            </a>
          </div>
        ) : null}
      </div>
      <div className="flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
