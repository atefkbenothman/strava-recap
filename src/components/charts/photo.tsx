import { useMemo, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { Image } from "lucide-react"
import Card from "../common/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "../ui/carousel"
import ReactPlayer from "react-player"
import Autoplay from "embla-carousel-autoplay"
import NoData from "../common/noData"
import { StravaPhoto } from "../../types/strava"

type MediaItemProps = {
  item: StravaPhoto
  index: number
}

const MediaItem = ({ item, index }: MediaItemProps) => {
  if (item.video_url) {
    return (
      <CarouselItem key={index} className="flex items-center justify-center overflow-hidden pl-2">
        <ReactPlayer
          url={item.video_url.split("?")[0]}
          loop
          muted
          playsinline
          controls
        />
      </CarouselItem>
    )
  }

  return (
    <CarouselItem key={index} className="flex items-center justify-center pl-2">
      <img
        src={item.urls[2000]}
        className="rounded h-[350px]"
        alt={`Photo ${index + 1}`}
        loading="lazy"
      />
    </CarouselItem>
  )
}

const NavigationButtons = ({ api }: { api: CarouselApi | undefined }) => (
  <div className="flex items-center">
    <button
      className="absolute left-4 text-lg"
      onClick={() => api?.scrollPrev()}
      aria-label="Previous slide"
    >
      {"<"}
    </button>
    <button
      className="absolute right-4 text-lg"
      onClick={() => api?.scrollNext()}
      aria-label="Next slide"
    >
      {">"}
    </button>
  </div>
)

export default function Photo() {
  const { photosData, photosLoading } = useStravaActivityContext()

  const [api, setApi] = useState<CarouselApi>()

  const { description, showNavigation } = useMemo(() => {
    if (!photosData?.length) {
      return { description: "", showNavigation: false }
    }

    return {
      description: new Date(photosData[0].created_at_local).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      showNavigation: photosData.length > 1
    }
  }, [photosData])

  if (photosLoading) {
    return (
      <Card
        title="Photo"
        icon={<Image size={17} strokeWidth={2} />}
      >
        <p className="font-semibold p-6 text-slate-500 dark:text-slate-400">loading...</p>
      </Card>
    )
  }

  if (!photosData) {
    return (
      <Card
        title="Photo"
        icon={<Image size={17} strokeWidth={2} />}
      >
        <NoData />
      </Card>
    )
  }

  return (
    <Card
      title="Photo"
      description={description}
      icon={<Image size={17} strokeWidth={2} />}
    >
      <div className="h-full w-full items-center justify-center flex p-6 py-8">
        <Carousel
          className="min-h-[300px] h-[300px] w-full flex items-center justify-center"
          plugins={[
            Autoplay({
              delay: 10000
            })
          ]}
          setApi={setApi}
          opts={{ loop: true }}
        >
          <CarouselContent className="-ml-2">
            {photosData.map((item, index) => (
              <MediaItem
                key={`${item.created_at_local}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </CarouselContent>
          {showNavigation && <NavigationButtons api={api} />}
        </Carousel>
      </div>
    </Card>
  )
}