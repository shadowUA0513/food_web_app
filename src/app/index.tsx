import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { AppProvider } from './providers/app-provider'
import './styles/index.css'
import { AppRouter } from './router'
import { initializeTelegramApp } from '../shared/services/telegram.service'
import '../shared/i18n'

initializeTelegramApp()

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}
