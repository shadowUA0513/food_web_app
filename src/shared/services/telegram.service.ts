import { TELEGRAM_MOBILE_WIDTH } from '../config/telegram'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser
}

interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe?: TelegramWebAppInitDataUnsafe
  themeParams?: TelegramThemeParams
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
}

class TelegramService {
  private get webApp() {
    return window.Telegram?.WebApp
  }

  initialize() {
    const webApp = this.webApp

    document.body.classList.add('telegram-ready')

    if (!webApp) {
      return
    }

    webApp.ready()
    webApp.expand()

    const headerColor = '#f6f6f6'
    const backgroundColor = webApp.themeParams?.bg_color ?? '#f6f6f6'

    webApp.setHeaderColor?.(headerColor)
    webApp.setBackgroundColor?.(backgroundColor)
  }

  getUser() {
    return this.webApp?.initDataUnsafe?.user
  }

  isTelegramEnvironment() {
    return Boolean(this.webApp)
  }

  getViewportWidth() {
    return Math.min(window.innerWidth, TELEGRAM_MOBILE_WIDTH)
  }
}

export const telegramService = new TelegramService()

export function initializeTelegramApp() {
  telegramService.initialize()
}
