import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import poweredByStravaLogoOrange from "/powered-by-strava-orange.svg"

export default function InfoDialog() {
  const email = import.meta.env.VITE_EMAIL
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Info
          strokeWidth={2}
          color="#525252"
          className="hover:cursor-pointer hover:scale-125"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Fitness Recap</DialogTitle>
          <DialogDescription className="text-gray-600">
            Explore yearly recaps of your Strava activities
          </DialogDescription>
          <DialogDescription className="py-8 px-4 text-xs flex flex-col gap-4 text-black">
            <p>- This website will only ask for read permissions. No writes will be made.</p>
            <p>- No data is collected or shared. All data stays in browser.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogDescription>
          <div className="flex">
            <div className="text-black text-xs font-semibold">
              <p>contact: {email}</p>
              <p>&nbsp;github: <span><a className="text-blue-500 underline" target="_blank" href="https://github.com/atefkbenothman/strava-recap">source code</a></span></p>
            </div>
            <img
              className="ml-auto"
              src={poweredByStravaLogoOrange}
              alt="powered by strava logo"
              width={70}
              height={80}
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog >
  )
}