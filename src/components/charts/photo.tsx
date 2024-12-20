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

  return (
    <Card
      title="Photo"
      description={new Date(photo[0].created_at_local).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      icon={< Image size={17} strokeWidth={2} />}
    >
      <div className="h-full w-full items-center justify-center flex px-2 py-1">
        <Carousel
          className="h-full w-full flex items-center justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          plugins={[
            Autoplay({
              delay: 10000
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
                        url={p.video_url.split("?")[0]}
                        loop
                        controls
                        muted
                        playsinline
                        playing
                      />
                    </div>
                  </CarouselItem>
                )
              } else {
                return (
                  <CarouselItem key={idx} className="flex items-center justify-center">
                    <img src={p.urls[2000]} className="rounded aspect-auto max-h-[330px]" />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
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