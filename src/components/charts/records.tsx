import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"

export default function Records() {
  const { activities } = useContext(RecapContext)
  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-lg font-semibold m-1">Records</p>
      <div className="flex w-full h-full items-center justify-center p-2">
        <div className="flex w-full h-full grid grid-cols-2 gap-2">
          <div className="bg-[#e0e0e0] rounded-lg p-1">
            <p className="m-1">Top Speed</p>
          </div>
          <div className="bg-[#e0e0e0] rounded-lg p-1">
            <p className="m-1">Max Heartrate</p>
          </div>
          <div className="bg-[#e0e0e0] rounded-lg p-1">
            <p className="m-1">Max Watts</p>
          </div>
          <div className="bg-[#e0e0e0] rounded-lg p-1">
            <p className="m-1">Top Elevation Gain</p>
          </div>
        </div>
      </div>
    </div>
  )
}
