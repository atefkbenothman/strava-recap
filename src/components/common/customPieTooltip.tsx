export const CustomPieTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload) {
    return null
  }
  return (
    <div className="bg-white dark:bg-black bg-opacity-90 p-2 rounded flex-col space-y-2">
      <div className="flex flex-col gap-1">
        {payload.map((p: any, idx: number) => {
          const dataKey = p.dataKey
          if (p.payload[dataKey] !== 0) {
            return (
              <p key={idx} style={{ color: p.payload.color }}>{p.name}: <span className="font-semibold">{Number(p.payload[dataKey].toFixed(2))}</span></p>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}