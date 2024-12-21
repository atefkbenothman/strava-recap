import { useEffect, useRef, useState } from "react"
import { useStravaActivityContext } from "../../hooks/useStravaActivityContext"
import { Image } from "lucide-react"
import Card from "../common/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "../ui/carousel"
import ReactPlayer from "react-player"
import Autoplay from "embla-carousel-autoplay"
import NoData from "../common/noData"


export default function Photo() {
  const { photo, photoLoading } = useStravaActivityContext()

  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
    // setCount(api.scrollSnapList().length)
    // setCurrent(api.selectedScrollSnap() + 1)
    // api.on("select", () => {
    //   setCurrent(api.selectedScrollSnap() + 1)
    // })
  }, [api])

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
          className="min-h-[350px] h-[350px] w-full flex items-center justify-center p-2"
          plugins={[
            Autoplay({
              delay: 10000
            })
          ]}
          setApi={setApi}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {photo && photo.map((p, idx) => {
              if (p.video_url) {
                return (
                  <CarouselItem key={idx} className="flex items-center justify-center overflow-hidden">
                    <ReactPlayer
                      url={p.video_url.split("?")[0]}
                      loop
                      muted
                      playsinline
                      // playing
                      controls
                    />
                  </CarouselItem>
                )
              } else {
                return (
                  <CarouselItem key={idx} className="flex items-center justify-center">
                    <img src={p.urls[2000]} className="rounded h-[350px]" />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
        </Carousel>
        {photo && photo.length > 1 ? (
          <div className="flex items-center">
            <button className="absolute left-7 text-lg" onClick={() => api?.scrollPrev()}>{"<"}</button>
            <button className="absolute right-7 text-lg" onClick={() => api?.scrollNext()}>{">"}</button>
          </div>
        ) : null}
      </div >
    </Card >
  )
}
// {photo && photo.map((p, idx) => {
//   if (p.video_url) {
//     return (
//       <CarouselItem key={idx} className="">
//         <div className="bg-red-500">
//           <ReactPlayer
//             url={p.video_url.split("?")[0]}
//             loop
//             controls
//             muted
//             playsinline
//             playing
//           />
//         </div>
//       </CarouselItem>
//     )
//   } else {
//     return (
//       <CarouselItem key={idx} className="flex items-center justify-center">
//         <img src={p.urls[2000]} className="rounded aspect-auto max-h-[330px]" />
//       </CarouselItem>
//     )
//   }
// })}
{/* {photo && photo.length > 1 ? (
            <>
              <CarouselPrevious
                className={`dark:text-black transition-opacity duration-300 ${isHovering ? 'visible' : 'invisible'}`}
              />
              <CarouselNext
                className={`dark:text-black transition-opacity duration-300 ${isHovering ? 'visible' : 'invisible'}`}
              />
            </>
          ) : null} */}