import { createContext, useContext } from 'react'
import { DEFAULT_BRAND_COLOR, createBrandScale } from '../theme/theme'

interface BrandThemeContextValue {
  brandColor: string
  brandScale: readonly string[]
}

const defaultBrandScale = createBrandScale(DEFAULT_BRAND_COLOR)

export const BrandThemeContext = createContext<BrandThemeContextValue>({
  brandColor: DEFAULT_BRAND_COLOR,
  brandScale: defaultBrandScale,
})

export function useBrandTheme() {
  return useContext(BrandThemeContext)
}
