import { createTheme } from '@mantine/core'

export const DEFAULT_BRAND_COLOR = '#f78f26'

export function normalizeHexColor(color?: string) {
  if (!color) {
    return DEFAULT_BRAND_COLOR
  }

  const normalized = color.trim()

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized.toLowerCase()
  }

  return DEFAULT_BRAND_COLOR
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

export function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(normalizeHexColor(hex))

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0'),
    )
    .join('')}`
}

function mixColors(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex)
  const target = hexToRgb(targetHex)

  return rgbToHex(
    base.r * weight + target.r * (1 - weight),
    base.g * weight + target.g * (1 - weight),
    base.b * weight + target.b * (1 - weight),
  )
}

export function createBrandScale(brandColor?: string) {
  const base = normalizeHexColor(brandColor)

  return [
    mixColors(base, '#ffffff', 0.1),
    mixColors(base, '#ffffff', 0.2),
    mixColors(base, '#ffffff', 0.35),
    mixColors(base, '#ffffff', 0.5),
    mixColors(base, '#ffffff', 0.7),
    base,
    mixColors(base, '#000000', 0.88),
    mixColors(base, '#000000', 0.76),
    mixColors(base, '#000000', 0.64),
    mixColors(base, '#000000', 0.52),
  ] as const
}

export function buildTheme(brandColor?: string) {
  return createTheme({
    primaryColor: 'primary',
    fontFamily: 'Segoe UI, Trebuchet MS, sans-serif',
    headings: {
      fontFamily: 'Segoe UI, Trebuchet MS, sans-serif',
    },
    colors: {
      primary: createBrandScale(brandColor),
    },
    defaultRadius: 'lg',
    black: '#161616',
    white: '#ffffff',
    primaryShade: 5,
  })
}

export const theme = buildTheme()
