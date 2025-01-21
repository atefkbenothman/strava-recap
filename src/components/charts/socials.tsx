import { useMemo } from "react"
import { ThumbsUp } from 'lucide-react'
import Card from "../common/card"
import Stat from "../common/stat"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { ActivityData } from "../../types/activity"

export const calculateSocialStats = (data: ActivityData) => {
  if (!data || data.all.length === 0) {
    return { kudosCount: 0, commentCount: 0 }
  }

  return data.all.reduce((acc, act) => ({
    kudosCount: acc.kudosCount + (act.kudos_count || 0),
    commentCount: acc.commentCount + (act.comment_count || 0)
  }), { kudosCount: 0, commentCount: 0 })
}

/*
 * Social stats
*/
export default function Socials() {
  const { activitiesData } = useStravaActivityContext()

  const { kudosCount, commentCount } = useMemo(() => {
    if (!activitiesData) {
      return { kudosCount: 0, commentCount: 0 }
    }
    try {
      return calculateSocialStats(activitiesData)
    } catch (err) {
      console.warn(err)
      return { kudosCount: 0, commentCount: 0 }
    }
  }, [activitiesData])

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