type CardProps = {
  title?: string
  description?: string
  children?: React.ReactNode
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="flex flex-col w-full relative h-[400px] p-2">
      <p className="font-semibold">{title}</p>
      <p className="text-xs font-normal text-gray-800 w-1/2">{description}</p>
      <div className="flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
{/* <div className="absolute top-2 right-2 rounded text-right">
        <p className="text-3xl">{totalActivities}</p>
        <p style={{ fontSize: "10px" }}>activities</p>
      </div> */}