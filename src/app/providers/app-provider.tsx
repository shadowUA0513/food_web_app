import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { theme } from '../theme/theme'

interface AppProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-center" />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
