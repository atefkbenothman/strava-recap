type CardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
  total?: number
  totalUnits?: string
  icon?: React.ReactNode
}

export default function Card({ title, description, children, total, totalUnits, icon }: CardProps) {
  return (
    <div className="flex flex-col w-full h-full relative p-2">
      <div className="flex gap-4 pb-2">
        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-center">
            {icon ? (
              icon
            ) : null}
            <p className="font-semibold text-sm">{title}</p>
          </div>
          <p className="text-[10px] font-normal text-gray-700 pl-6">{description}</p>
        </div>
        {total ? (
          <div className="text-right">
            <p className="ml-auto font-bold text-xl bg-gray-300 p-1 rounded w-fit">{total}</p>
            <p className="ml-auto text-[10px] p-1">{totalUnits}</p>
          </div>
        ) : null}
      </div>
      <div className="flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
