import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "./ui/dialog"
import { Separator } from "../components/ui/separator"

import poweredByStravaLogoOrange from "/powered-by-strava-orange.svg"

const email = import.meta.env.VITE_EMAIL

interface AboutDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AboutDialog({ trigger, open, onOpenChange }: AboutDialogProps) {
  useEffect(() => {
    if (open) {
      // remove focus from all elements when the dialog opens
      document.activeElement instanceof HTMLElement && document.activeElement.blur()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="dark:bg-[#1a1a1a] dark:border-none dark:text-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Fitness Recap</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-white/80">
            Explore yearly recaps of your Strava activities
          </DialogDescription>
        </DialogHeader>
        <div>
          <DialogDescription className="m-4 text-xs flex flex-col gap-4 text-black dark:text-white items-center justify-center w-[70%]">
            <p>* This website will only ask for read permissions. No writes will be made.</p>
            <p>* No data is collected or shared. All data stays in browser.</p>
            <p>* This project is open source! Feel free to use the github link to contribute your own charts/graphs.</p>
          </DialogDescription>
        </div>
        <Separator className="" />
        <DialogDescription>
          <div className="flex">
            <div className="text-black dark:text-white text-xs font-semibold">
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
    </Dialog>
  )
}