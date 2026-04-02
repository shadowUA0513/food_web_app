import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { AppProvider } from './providers/app-provider'
import './styles/index.css'
import { HomePage } from '../pages/home-page'
import { initializeTelegramApp } from '../shared/services/telegram.service'

initializeTelegramApp()

export function App() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  )
}
