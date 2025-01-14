import { useEffect, useState } from "react"
import { ThumbsUp } from 'lucide-react'
import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { ActivityData } from "../../types/activity"

const sanitizeData = (data: ActivityData): { kudosCount: number, commentCount: 0 } => {
  if (!data || !data.all || data.all.length === 0) {
    return { kudosCount: 0, commentCount: 0 }
  }
  return data.all.reduce((acc, act) => {
    if (act.kudos_count) {
      acc.kudosCount += act.kudos_count
    }
    if (act.comment_count) {
      acc.commentCount += act.comment_count
    }
    return acc
  }, { kudosCount: 0, commentCount: 0 })
}

/*
 * Social stats
*/
export default function Socials() {
  const { activityData } = useStravaActivityContext()

  const [kudosCount, setKudosCount] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)

  useEffect(() => {
    if (!activityData) return
    try {
      const { kudosCount, commentCount } = sanitizeData(activityData)
      setKudosCount(kudosCount)
      setCommentCount(commentCount)
    } catch (err) {
      console.warn(err)
      setKudosCount(0)
      setCommentCount(0)
    }
  }, [activityData])

  return (
    <Card
      title="Socials"
      description="total kudos and comments received"
      icon={<ThumbsUp size={15} strokeWidth={2} />}
    >
      <div className="w-full grid grid-rows-2 p-2 gap-2">
        <Stat
          value={String(kudosCount)}
          unit="kudos"
        />
        <Stat
          value={String(commentCount)}
          unit="comments"
        />
      </div>
    </Card>
  )
}