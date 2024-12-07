import { SportType } from "../types/strava"

export const Theme = {
  emerald: [
    "#06d6a0",
    "#20aaa1",
    "#198190",
    "#0e5d72",
    "#073b4c"
  ],
  one: [
    "#ccebc5",
    "#a8ddb5",
    "#7bccc4",
    "#4eb3d3",
    "#2b8cbe",
    "#0868ac",
    "#084081"
  ],
  two: [
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#253494"
  ],
  divergent: [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
  ]
} as const

export type ThemeName = keyof typeof Theme

export type SportColors = {
  [key in SportType]?: string
}

// create or update color palette
export function generateColorPalette(
  sportTypes: SportType[],
  themeName: ThemeName,
  colorPalette: SportColors,
  reset: boolean = false
): SportColors {
  let updatedColorPalette: SportColors = { ...colorPalette }
  if (reset) {
    updatedColorPalette = {}
  }
  const colors = Theme[themeName]
  sportTypes.forEach(sport => {
    if (updatedColorPalette[sport as SportType]) {
      return
    }
    const usedColors = new Set(Object.values(updatedColorPalette))
    const availableColor = colors.find(color => !usedColors.has(color))
    if (availableColor) {
      updatedColorPalette[sport as SportType] = availableColor
    }
  })
  return updatedColorPalette
}

export function getRandomColor(colors: readonly string[]) {
  return colors[Math.floor(Math.random() * colors.length)]
}