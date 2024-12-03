export const THEME = {
  "emerald": {
    "colors": ['#06d6a0', '#20aaa1', '#198190', '#0e5d72', '#073b4c'],
  },
  "one": {
    "colors": ["#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
  },
  "two": {
    "colors": ["#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494"],
  },
  "divergent": {
    "colors": ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2",]
  }
} as const

export type ThemeKey = keyof typeof THEME