type CardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
  total?: number
  totalUnits?: string
}

export default function Card({ title, description, children, total, totalUnits }: CardProps) {
  return (
    <div className="flex flex-col w-full h-full relative p-2">
      <div className="flex gap-4 pb-2">
        <div className="flex flex-col w-full">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-[10px] font-normal text-gray-700">{description}</p>
        </div>
        <div className="text-right">
          <p className="ml-auto font-bold text-xl bg-gray-300 p-1 rounded w-fit">{total}</p>
          <p className="ml-auto text-[10px] p-1">{totalUnits}</p>
        </div>
      </div>
      <div className="flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
