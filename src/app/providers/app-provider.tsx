import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { useCompanySettings } from '../../service/settings'
import { getCompanyId } from '../../widgets/home-screen/ui/home-utils'
import { BrandThemeContext } from './brand-theme-context'
import { buildTheme, createBrandScale, normalizeHexColor } from '../theme/theme'

interface AppProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

function AppThemeProvider({ children }: AppProviderProps) {
  const companyId = getCompanyId()
  const { data: settings } = useCompanySettings(companyId)
  const brandColor = useMemo(
    () => normalizeHexColor(settings?.brand_color),
    [settings?.brand_color],
  )
  const brandScale = useMemo(() => createBrandScale(brandColor), [brandColor])
  const theme = useMemo(
    () => buildTheme(brandColor),
    [brandColor],
  )
  const brandStyle = useMemo(
    () =>
      ({
        '--app-brand-color': brandColor,
        '--app-brand-color-soft': brandScale[2],
        '--app-brand-color-muted': brandScale[0],
        minHeight: '100dvh',
      }) as CSSProperties,
    [brandColor, brandScale],
  )

  return (
    <BrandThemeContext.Provider value={{ brandColor, brandScale }}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <div style={brandStyle}>
          <Notifications position="top-center" />
          {children}
        </div>
      </MantineProvider>
    </BrandThemeContext.Provider>
  )
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </QueryClientProvider>
  )
}
