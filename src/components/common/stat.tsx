type StatProps = {
  label?: string
  value: string
  unit: string
}

export default function Stat({ label, value, unit }: StatProps) {
  return (
    <div className="flex flex-col bg-gray-200 rounded p-2 gap-4 dark:bg-[#222628]">
      {label ? (
        <p className="text-[10px] dark:text-white/75 text-black/75">{label}</p>
      ) : null}
      <div className="flex flex-col w-full h-full items-center justify-center">
        <p className="font-semibold text-xl">
          {value}
        </p>
        <p className="text-xs"> {unit}</p>
      </div>
    </div>
  )
}