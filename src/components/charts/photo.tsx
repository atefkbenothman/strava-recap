import { useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { Image } from "lucide-react"
import Card from "../common/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import ReactPlayer from "react-player"
import Autoplay from "embla-carousel-autoplay"
import NoData from "../common/noData"


export default function Photo() {
  const { photo, photoLoading } = useStravaActivityContext()

  const [isHovering, setIsHovering] = useState<boolean>(false)

  if (!photo) {
    return (
      <Card
        title="Photo"
        icon={<Image size={17} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  if (photoLoading) {
    return (
      <Card
        title="Photo"
        icon={<Image size={17} strokeWidth={2} />}
      >
        <p>loading...</p>
      </Card>
    )
  }

  console.log(photo)

  return (
    <Card
      title="Photo"
      icon={< Image size={17} strokeWidth={2} />}
    >
      <div className="h-full w-full items-center justify-center flex p-2">
        <Carousel
          className="h-full w-full flex-col items-center justify-center space-y-2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          plugins={[
            Autoplay({
              delay: 9000
            })
          ]}
        >
          <CarouselContent>
            {photo && photo.map((p, idx) => {
              if (p.video_url) {
                return (
                  <CarouselItem key={idx} className="w-full h-full">
                    <div className="h-full w-full flex items-center justify-center">
                      <ReactPlayer
                        url={p.video_url}
                        loop
                        controls
                        muted
                        playsinline
                      />
                    </div>
                  </CarouselItem>
                )
              } else {
                return (
                  <CarouselItem key={idx} className="flex items-center justify-center">
                    <img src={p.urls[2000]} className="rounded aspect-auto max-h-[350px]" />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
          <p className="text-xs dark:text-white/70 flex items-center justify-center">
            {new Date(photo[0].created_at_local).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
          {photo && photo.length > 1 ? (
            <>
              <CarouselPrevious
                className={`dark:text-black transition-opacity duration-300 ${isHovering ? 'visible' : 'invisible'}`}
              />
              <CarouselNext
                className={`dark:text-black transition-opacity duration-300 ${isHovering ? 'visible' : 'invisible'}`}
              />
            </>
          ) : null}
        </Carousel>
      </div>
    </Card >
  )
}