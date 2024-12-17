type StatProps = {
  label: string
  value: string
  unit: string
}

export default function Stat({ label, value, unit }: StatProps) {
  return (
    <div className="flex flex-col bg-gray-200 rounded p-2 gap-4 dark:bg-[#222628]">
      <p className="text-[10px]">{label}</p>
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-xl">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}