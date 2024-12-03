import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const unitConversion = {
  convertFromMetersToKm: (meters: number): number => {
    return meters * 0.01
  },
  convertFromMetersToMi: (meters: number): number => {
    return meters * 0.000621371
  },
  convertFromMetersToFeet: (meters: number): number => {
    return meters * 3.28084
  },
  convertSecondsToHours: (seconds: number): number => {
    return seconds / 3600
  },
  convertSecondsToMinutes: (seconds: number): number => {
    return seconds / 60
  },
  convertMetersPerSecondToMph: (mps: number): number => {
    return mps * 2.23694
  }
}