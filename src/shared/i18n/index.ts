import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      settings: {
        title: "Sozlamalar",
        language: "Til",
        chooseLanguage: "Ilova tilini tanlang",
        darkMode: "Tungi rejim",
        switchAppearance: "Ko'rinishni almashtirish"
      },
      cart: {
        title: "Savat",
        emptyTitle: "Savat bo'sh",
        emptyDescription: "Mahsulot tanlasangiz, shu yerda ko'rinadi.",
        total: "Jami"
      },
      menu: {
        titleFallback: "Taomlar menyusi",
        subtitle: "Taomlarni tez tanlang",
        categories: "Kategoriyalar",
        loadError: "Menyuni yuklab bo'lmadi",
        emptyTitle: "Mahsulot topilmadi",
        emptyDescription: "Menyu yuklandi, lekin hozircha ko'rsatish uchun mahsulot yo'q.",
        productFallbackDescription: "Yangi masalliqlar va tez yetkazib berish."
      },
      product: {
        title: "Mahsulot",
        loadError: "Mahsulotni yuklab bo'lmadi",
        quantity: "Miqdor",
        inCart: "Savatda: {{count}} dona",
        closed: "Yopiq",
        addToCart: "Savatga qo'shish",
        notFoundTitle: "Mahsulot topilmadi.",
        notFoundDescription: "Tanlangan mahsulot mavjud emas yoki hozircha ochiq emas."
      },
      common: {
        unknownError: "Noma'lum xatolik"
      }
    }
  },
  ru: {
    translation: {
      settings: {
        title: "Настройки",
        language: "Язык",
        chooseLanguage: "Выберите язык приложения",
        darkMode: "Темная тема",
        switchAppearance: "Сменить оформление"
      },
      cart: {
        title: "Корзина",
        emptyTitle: "Корзина пуста",
        emptyDescription: "Выбранные товары появятся здесь.",
        total: "Итого"
      },
      menu: {
        titleFallback: "Меню",
        subtitle: "Быстро выбирайте блюда",
        categories: "Категории",
        loadError: "Не удалось загрузить меню",
        emptyTitle: "Товары не найдены",
        emptyDescription: "Меню загружено, но сейчас нет товаров для отображения.",
        productFallbackDescription: "Свежие ингредиенты и быстрая доставка."
      },
      product: {
        title: "Товар",
        loadError: "Не удалось загрузить товар",
        quantity: "Количество",
        inCart: "Уже в корзине: {{count}}",
        closed: "Закрыто",
        addToCart: "В корзину",
        notFoundTitle: "Товар не найден.",
        notFoundDescription: "Выбранный товар не существует или сейчас недоступен."
      },
      common: {
        unknownError: "Неизвестная ошибка"
      }
    }
  }
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
