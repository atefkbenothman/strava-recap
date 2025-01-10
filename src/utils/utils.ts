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


export type TrendCoefficients = {
  slope: number
  intercept: number
  canShowLine: boolean
}

type Point = {
  [key: string]: number | string
}

export function calculateTrendLine<T extends Point>(
  data: T[],
  xKey: keyof T,
  yKey: keyof T
): TrendCoefficients {
  const n = data.length
  if (n <= 1) {
    return { slope: 0, intercept: 0, canShowLine: false }
  }
  // Check if all x values are the same
  const allSameX = data.every(point => point[xKey] === data[0][xKey])
  if (allSameX) {
    return { slope: 0, intercept: 0, canShowLine: false }
  }
  const meanX = data.reduce((sum, point) => sum + (point[xKey] as number), 0) / n
  const meanY = data.reduce((sum, point) => sum + (point[yKey] as number), 0) / n
  const numerator = data.reduce((sum, point) => {
    return sum + ((point[xKey] as number) - meanX) * ((point[yKey] as number) - meanY)
  }, 0)
  const denominator = data.reduce((sum, point) => {
    return sum + Math.pow((point[xKey] as number) - meanX, 2)
  }, 0)
  if (denominator === 0) {
    return { slope: 0, intercept: 0, canShowLine: false }
  }
  const slope = numerator / denominator
  const intercept = meanY - slope * meanX
  return { slope, intercept, canShowLine: true }
}

export type ReferenceLinePoints = [
  {
    x: number
    y: number
  },
  {
    x: number
    y: number
  }
]

export type ChartBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export function calculateTrendLinePoints(trend: TrendCoefficients, bounds: ChartBounds): ReferenceLinePoints {
  // Calculate y values at xMin and xMax
  const yAtXMin = trend.slope * bounds.xMin + trend.intercept
  const yAtXMax = trend.slope * bounds.xMax + trend.intercept
  // Initialize start and end points
  let startX = bounds.xMin
  let startY = yAtXMin
  let endX = bounds.xMax
  let endY = yAtXMax
  // Clip to y bounds if necessary
  if (yAtXMin < bounds.yMin) {
    startX = (bounds.yMin - trend.intercept) / trend.slope
    startY = bounds.yMin
  } else if (yAtXMin > bounds.yMax) {
    startX = (bounds.yMax - trend.intercept) / trend.slope
    startY = bounds.yMax
  }
  if (yAtXMax < bounds.yMin) {
    endX = (bounds.yMin - trend.intercept) / trend.slope
    endY = bounds.yMin
  } else if (yAtXMax > bounds.yMax) {
    endX = (bounds.yMax - trend.intercept) / trend.slope
    endY = bounds.yMax
  }
  // Ensure x values are within bounds
  startX = Math.max(bounds.xMin, Math.min(bounds.xMax, startX))
  endX = Math.max(bounds.xMin, Math.min(bounds.xMax, endX))
  return [
    { x: startX, y: startY },
    { x: endX, y: endY }
  ]
}