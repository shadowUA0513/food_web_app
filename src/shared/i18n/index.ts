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
        total: "Jami",
        accept: "Qabul qilish",
        clearAll: "Hammasini o'chirish",
        addedTitle: "Muvaffaqiyatli qo'shildi",
        addedMessage: "{{product}} savatga muvaffaqiyatli qo'shildi"
      },
      checkout: {
        title: "Buyurtmani rasmiylashtirish",
        subtitle: "Oxirgi qadam",
        orderDetails: "Buyurtma ma'lumotlari",
        description: "Izoh qoldiring va buyurtmangizni tasdiqlang.",
        orderTypeTitle: "Buyurtma turi",
        orderTypePartners: "Hamkor orqali",
        orderTypeMyself: "O'zim",
        orderTypePartnersHint: "Hamkorni tanlang va buyurtmani unga biriktiring.",
        orderTypeMyselfHint: "Buyurtmani o'zingiz uchun rasmiylashtiring.",
        paymentTitle: "To'lov turi",
        paymentDescription: "Qulay to'lov usulini tanlang.",
        paymentCash: "Naqd pul",
        paymentCashHint: "Buyurtma kelganda naqd pul bilan to'lang.",
        paymentPaymeHint: "Payme orqali tezkor onlayn to'lov.",
        paymentClickHint: "Click orqali qulay onlayn to'lov.",
        partnerDrawerTitle: "Hamkorlar",
        partnerDrawerDescription: "Buyurtma uchun hamkorni tanlang.",
        partnerMapTitle: "Xaritadan hamkorni tanlang",
        partnerMapDescription: "Mobil qurilmada markerga bosing yoki pastdagi kartadan tanlang.",
        partnerMapView: "Xarita",
        partnerListView: "Ro'yxat",
        partnerMapUnavailable: "Xarita yuklanmadi. Hamkorni ro'yxatdan tanlashingiz mumkin.",
        partnerNoCoordinates: "Hamkorlar uchun koordinatalar topilmadi.",
        partnerSelectedAction: "Tanlandi",
        choosePartner: "Hamkorni tanlash",
        selectedPartner: "Tanlangan hamkor",
        partnerLoadError: "Hamkorlar ro'yxatini yuklab bo'lmadi",
        partnerEmpty: "Hamkorlar topilmadi",
        contactTitle: "Qo'shimcha izoh",
        nameLabel: "Ismingiz",
        namePlaceholder: "Ismingizni kiriting",
        phoneLabel: "Telefon raqami",
        phonePlaceholder: "+998 90 123 45 67",
        addressLabel: "Manzil",
        addressPlaceholder: "Ko'cha, uy, mo'ljal",
        addressMapTitle: "Xaritadan manzilni tanlang",
        addressMapDescription: "Buyurtma yetkaziladigan joyni xaritada belgilang.",
        addressMapUnavailable: "Xarita yuklanmadi. Keyinroq qayta urinib ko'ring.",
        addressResolving: "Manzil aniqlanmoqda...",
        addressNotFound: "Bu nuqta uchun manzil topilmadi. Boshqa joyni tanlang.",
        selectedAddress: "Tanlangan manzil",
        commentLabel: "Izoh",
        commentPlaceholder: "Qo'shimcha so'rov yoki eslatma",
        summaryTitle: "Buyurtma tarkibi",
        itemCount: "{{count}} dona",
        total: "Jami",
        confirmOrder: "Buyurtmani tasdiqlash",
        submitPending: "Yuborilmoqda...",
        submitSuccessTitle: "Buyurtma yaratildi",
        submitSuccessMessage: "Buyurtmangiz qabul qilindi.",
        submitErrorTitle: "Buyurtmani yuborib bo'lmadi",
        validationName: "Ismingizni kiriting",
        validationPhone: "Telefon raqamini kiriting",
        validationAddress: "Manzilni kiriting",
        missingPartner: "Hamkorni tanlang",
        missingUser: "Telegram foydalanuvchisi topilmadi",
        emptyTitle: "Buyurtma uchun mahsulot yo'q",
        emptyDescription: "Checkout sahifasiga o'tishdan oldin savatga mahsulot qo'shing.",
        backToMenu: "Menyuga qaytish"
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
        total: "Итого",
        accept: "Принять",
        clearAll: "Очистить все",
        addedTitle: "Успешно добавлено",
        addedMessage: "{{product}} успешно добавлен в корзину"
      },
      checkout: {
        title: "Оформление заказа",
        subtitle: "Последний шаг",
        orderDetails: "Детали заказа",
        description: "Оставьте комментарий и подтвердите заказ.",
        orderTypeTitle: "Тип заказа",
        orderTypePartners: "Через партнера",
        orderTypeMyself: "Сам",
        orderTypePartnersHint: "Выберите партнера и привяжите к нему заказ.",
        orderTypeMyselfHint: "Оформите заказ для себя.",
        paymentTitle: "Способ оплаты",
        paymentDescription: "Выберите удобный способ оплаты.",
        paymentCash: "Наличные",
        paymentCashHint: "Оплатите наличными при получении заказа.",
        paymentPaymeHint: "Быстрая онлайн-оплата через Payme.",
        paymentClickHint: "Удобная онлайн-оплата через Click.",
        partnerDrawerTitle: "Партнеры",
        partnerDrawerDescription: "Выберите партнера для заказа.",
        partnerMapTitle: "Выберите партнера на карте",
        partnerMapDescription: "Нажмите на маркер на карте или выберите карточку ниже.",
        partnerMapView: "Карта",
        partnerListView: "Список",
        partnerMapUnavailable: "Карта не загрузилась. Вы можете выбрать партнера из списка.",
        partnerNoCoordinates: "Для партнеров не найдены координаты.",
        partnerSelectedAction: "Выбрано",
        choosePartner: "Выбрать партнера",
        selectedPartner: "Выбранный партнер",
        partnerLoadError: "Не удалось загрузить список партнеров",
        partnerEmpty: "Партнеры не найдены",
        contactTitle: "Комментарий к заказу",
        nameLabel: "Ваше имя",
        namePlaceholder: "Введите имя",
        phoneLabel: "Телефон",
        phonePlaceholder: "+998 90 123 45 67",
        addressLabel: "Адрес",
        addressPlaceholder: "Улица, дом, ориентир",
        addressMapTitle: "Выберите адрес на карте",
        addressMapDescription: "Отметьте на карте точку доставки заказа.",
        addressMapUnavailable: "Карта не загрузилась. Попробуйте позже.",
        addressResolving: "Определяем адрес...",
        addressNotFound: "Для этой точки не удалось определить адрес. Выберите другое место.",
        selectedAddress: "Выбранный адрес",
        commentLabel: "Комментарий",
        commentPlaceholder: "Пожелания к заказу",
        summaryTitle: "Состав заказа",
        itemCount: "{{count}} шт.",
        total: "Итого",
        confirmOrder: "Подтвердить заказ",
        submitPending: "Отправка...",
        submitSuccessTitle: "Заказ создан",
        submitSuccessMessage: "Ваш заказ успешно отправлен.",
        submitErrorTitle: "Не удалось отправить заказ",
        validationName: "Введите имя",
        validationPhone: "Введите номер телефона",
        validationAddress: "Введите адрес",
        missingPartner: "Выберите партнера",
        missingUser: "Пользователь Telegram не найден",
        emptyTitle: "Заказ пока пуст",
        emptyDescription: "Добавьте товары в корзину, прежде чем переходить к оформлению.",
        backToMenu: "Вернуться в меню"
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
