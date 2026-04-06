import { AppShell, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompanyMenu } from "../../../service/menu";
import { useCompanySettings } from "../../../service/settings";
import { useTelegramUser } from "../../../service/telegram-user";
import { showAppNotification } from "../../../shared/lib/notifications";
import { useCartStore } from "../../../shared/store/cart-store";
import type { Product } from "../../../types/menu";
import { CartDrawer } from "./components/cart-drawer";
import { FloatingCartButton } from "./components/floating-cart-button";
import { MenuContent } from "./components/menu-content";
import { SettingsDrawer } from "./components/settings-drawer";
import { formatPrice, getCompanyId, getTelegramId } from "./home-utils";
import type { Locale } from "./home-screen-types";

export function HomeScreen() {
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { i18n, t } = useTranslation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const navigate = useNavigate();
  const location = useLocation();

  const companyId = getCompanyId();
  const telegramId = getTelegramId();
  const { data: settings } = useCompanySettings(companyId);
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useCompanyMenu(companyId);

  const visibleCategories = useMemo(
    () => categories.filter(({ products }) => products.length > 0),
    [categories],
  );

  const cartTotalCount = useCartStore((state) => state.totalCount);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartList = useMemo(() => Object.values(cartItems), [cartItems]);
  const cartTotalPrice = useMemo(
    () => cartList.reduce((sum, item) => sum + item.product.price * item.count, 0),
    [cartList],
  );

  const locale: Locale = i18n.resolvedLanguage === "uz" ? "uz" : "ru";
  const isCartOpened = location.pathname === "/cart";
  const isDark = computedColorScheme === "dark";
  const pageBg = isDark ? "#111318" : "#f3f4f6";
  const surfaceBg = isDark ? "#181b21" : "#ffffff";
  const titleColor = isDark ? "#f3f4f6" : "#151515";
  const textColor = isDark ? "#b4bcc8" : "#5f6670";
  const mutedBg = isDark ? "#20242c" : "#f8f9fb";
  useTelegramUser(telegramId, location.pathname === "/");

  function getLocalizedValue(nameUz: string, nameRu: string) {
    return locale === "uz" ? nameUz || nameRu : nameRu || nameUz;
  }

  function openProductPage(product: Product) {
    navigate({
      pathname: `/product/${product.id}`,
      search: location.search,
    });
  }

  function openCartDrawer() {
    navigate({
      pathname: "/cart",
      search: location.search,
    });
  }

  function closeCartDrawer() {
    navigate({
      pathname: "/",
      search: location.search,
    });
  }

  function openCheckoutPage() {
    navigate({
      pathname: "/checkout",
      search: location.search,
    });
  }

  function addProductToCart(product: Product) {
    addItem(product, 1);
    showAppNotification({
      title: t("cart.addedTitle"),
      message: t("cart.addedMessage", {
        product: getLocalizedValue(product.name_uz, product.name_ru),
      }),
      icon: <IconCheck size={16} />,
    });
  }

  return (
    <AppShell bg={pageBg} padding={0}>
      <SettingsDrawer
        opened={settingsOpened}
        onClose={closeSettings}
        locale={locale}
        onLocaleChange={(nextLocale) => {
          void i18n.changeLanguage(nextLocale);
        }}
        isDark={isDark}
        onToggleDarkMode={(enabled) => setColorScheme(enabled ? "dark" : "light")}
        surfaceBg={surfaceBg}
        titleColor={titleColor}
        textColor={textColor}
        mutedBg={mutedBg}
      />

      <CartDrawer
        opened={isCartOpened}
        onClose={closeCartDrawer}
        cartList={cartList}
        cartTotalPrice={cartTotalPrice}
        isDark={isDark}
        surfaceBg={surfaceBg}
        titleColor={titleColor}
        textColor={textColor}
        mutedBg={mutedBg}
        incrementItem={incrementItem}
        decrementItem={decrementItem}
        clearCart={clearCart}
        getLocalizedValue={getLocalizedValue}
        formatPrice={formatPrice}
        onCheckout={openCheckoutPage}
      />

      <AppShell.Main className="home-main-scroll" style={{ overflowY: "auto" }}>
        <MenuContent
          locale={locale}
          settings={settings}
          visibleCategories={visibleCategories}
          isLoading={isLoading}
          isError={isError}
          error={error}
          isDark={isDark}
          pageBg={pageBg}
          surfaceBg={surfaceBg}
          titleColor={titleColor}
          textColor={textColor}
          mutedBg={mutedBg}
          onOpenSettings={openSettings}
          onOpenProduct={openProductPage}
          onAddToCart={addProductToCart}
          getLocalizedValue={getLocalizedValue}
          formatPrice={formatPrice}
        />
      </AppShell.Main>

      <FloatingCartButton
        totalCount={cartTotalCount}
        isDark={isDark}
        onClick={openCartDrawer}
      />
    </AppShell>
  );
}
