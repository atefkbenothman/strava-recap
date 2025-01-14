export const CustomScatterTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload) {
    return null
  }
  const name = payload[0].payload.name ?? ""
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <p className="text-md text-balance font-semibold">{name}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <div key={idx} className="flex gap-2 text-black dark:text-gray-200" style={{ color: p.payload.fill }}>
                <p className="font-bold">{p.payload[dataKey]}</p>
                <p>{p.unit}</p>
              </div>
            )
          }
          return null
        })}
      </div>
    </div >
  )
}