import { useContext } from "react"
import { RecapContext } from "../../contexts/recapContext"
import { ThumbsUp } from 'lucide-react'

import Card from "../card"
import Stat from "../stat"


export default function Socials() {
  const { activities } = useContext(RecapContext)
  let kudosCount = 0
  let commentCount = 0
  activities.map(activity => {
    kudosCount += activity.kudos_count ?? 0
    commentCount += activity.comment_count ?? 0
    return activity
  })
  return (
    <Card title="Socials" description="number of kudos and comments" icon={<ThumbsUp size={15} strokeWidth={2} />}>
      <div className="flex w-full grid grid-rows-2 p-2 gap-2">
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