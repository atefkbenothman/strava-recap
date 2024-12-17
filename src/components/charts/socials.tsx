import { useEffect, useState } from "react"
import { ThumbsUp } from 'lucide-react'

import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"


/*
 * Social stats
*/
export default function Socials() {
  const { activityData } = useStravaActivityContext()

  const [kudosCount, setKudosCount] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    let kCount = 0
    let cCount = 0
    activityData.all!.forEach(activity => {
      kCount += activity.kudos_count ?? 0
      cCount += activity.comment_count ?? 0
    })
    setKudosCount(kCount)
    setCommentCount(cCount)
  }, [activityData])

  return (
    <Card
      title="Socials"
      description="total kudos and comments received"
      icon={<ThumbsUp size={15} strokeWidth={2} />}
    >
      <div className="w-full grid grid-rows-2 p-2 gap-2">
        <Stat
          label="Kudos Count"
          value={String(kudosCount)}
          unit="kudos"
        />
        <Stat
          label="Comment Count"
          value={String(commentCount)}
          unit="comments"
        />
      </div>
    </Card>
  )
}