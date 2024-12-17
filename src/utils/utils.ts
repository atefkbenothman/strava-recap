import { Units } from "../types/activity"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Theme, ColorPalette, Themes } from "../contexts/themeContext"
import { SportType } from "../types/strava"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const unitConversion = {
  convertDistance: (value: number, toUnit: Units): number => {
    switch (toUnit) {
      case "metric":
        return value * 0.001
      case "imperial":
        return value * 0.000621371
      default:
        throw new Error(`Unsupported unit type: ${toUnit}`)
    }
  },
  convertElevation: (value: number, toUnit: Units): number => {
    switch (toUnit) {
      case "metric":
        return value
      case "imperial":
        return value * 3.28084
      default:
        throw new Error(`Unsupported unit type: ${toUnit}`)
    }
  },
  convertTime: (value: number, toUnit: "minutes" | "hours"): number => {
    switch (toUnit) {
      case "minutes":
        return value / 60
      case "hours":
        return value / 3600
      default:
        throw new Error(`Unsupported unit type: ${toUnit}`)
    }
  },
  convertSpeed: (value: number, toUnit: Units): number => {
    switch (toUnit) {
      case "metric":
        return value * 3.6
      case "imperial":
        return value * 2.23694
      default:
        throw new Error(`Unsupported unit type: ${toUnit}`)
    }
  }
}

export function generateColorPalette(
  sportTypes: SportType[],
  theme: Theme,
  colorPalette: ColorPalette,
  reset: boolean = false
): ColorPalette {
  let updatedColorPalette: ColorPalette = { ...colorPalette }
  if (reset) { updatedColorPalette = {} }
  const colors = Themes[theme]
  sportTypes.forEach(sport => {
    if (updatedColorPalette[sport as SportType]) { return } // skip sports that have already been assigned a color
    const usedColors = new Set(Object.values(updatedColorPalette))
    const availableColor = colors.find(color => !usedColors.has(color))
    if (availableColor) {
      updatedColorPalette[sport] = availableColor
    }
  })
  return updatedColorPalette
}