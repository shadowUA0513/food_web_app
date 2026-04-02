import {
  ActionIcon,
  AppShell,
  Box,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { IconArrowLeft, IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCompanyMenu } from "../../../service/menu";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";
import { useCartStore } from "../../../shared/store/cart-store";

const DEFAULT_COMPANY_ID = "08d016ac-f8a2-4273-8219-806d5dd1fba1";

function getCompanyId() {
  const params = new URLSearchParams(window.location.search);

  return (
    params.get("company_id") ?? params.get("companyId") ?? DEFAULT_COMPANY_ID
  );
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} UZS`;
}

export function ProductDetailsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "uz" ? "uz" : "ru";
  const [count, setCount] = useState(1);
  const computedColorScheme = useComputedColorScheme("light");
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams<{ productId: string }>();
  const companyId = getCompanyId();
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useCompanyMenu(companyId);

  const allProducts = useMemo(
    () => categories.flatMap(({ products }) => products),
    [categories],
  );
  const activeProduct = useMemo(
    () => allProducts.find((product) => product.id === productId) ?? null,
    [allProducts, productId],
  );

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const activeProductCartCount = activeProduct
    ? (cartItems[activeProduct.id]?.count ?? 0)
    : 0;

  const isDark = computedColorScheme === "dark";
  const pageBg = isDark ? "#111318" : "#f3f4f6";
  const surfaceBg = isDark ? "#181b21" : "#ffffff";
  const titleColor = isDark ? "#f3f4f6" : "#151515";
  const textColor = isDark ? "#b4bcc8" : "#5f6670";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(17,24,39,0.08)";
  const pageGradient = isDark
    ? "linear-gradient(180deg, #0f1116 0%, #151922 100%)"
    : "linear-gradient(180deg, #f8f9fc 0%, #eef1f7 100%)";

  function getLocalizedValue(nameUz: string, nameRu: string) {
    return locale === "uz" ? nameUz || nameRu : nameRu || nameUz;
  }

  function goBack() {
    navigate({ pathname: "/", search: location.search });
  }

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    setCount(activeProductCartCount || 1);
  }, [activeProduct, activeProductCartCount]);

  function decreaseCount() {
    setCount((prev) => Math.max(1, prev - 1));
  }

  function increaseCount() {
    setCount((prev) => prev + 1);
  }

  function submitSelection() {
    if (!activeProduct) {
      return;
    }

    addItem(activeProduct, count);
    goBack();
  }

  return (
    <AppShell bg={pageBg} padding={0}>
      <AppShell.Main className="home-main-scroll" style={{ overflowY: "auto" }}>
        <Box mih="100dvh" bg={pageBg} px={12} py={14}>
          <Stack maw={TELEGRAM_MOBILE_WIDTH} mx="auto" gap="md">
            <Paper
              radius={18}
              p="xs"
              style={{
                background: surfaceBg,
                border: cardBorder,
                backdropFilter: "blur(8px)",
              }}
            >
              <Group justify="space-between" align="center" wrap="nowrap">
                <ActionIcon
                  size={38}
                  radius="xl"
                  variant="light"
                  color="gray"
                  onClick={goBack}
                >
                  <IconArrowLeft size={20} />
                </ActionIcon>
                <Text fw={700} c={textColor}>
                  {t("product.title")}
                </Text>
                <Box w={38} />
              </Group>
            </Paper>

            {isLoading ? (
              <Paper radius={20} p="lg" style={{ background: surfaceBg }}>
                <Group justify="center">
                  <Loader color="orange" />
                </Group>
              </Paper>
            ) : null}

            {isError ? (
              <Paper radius={20} p="lg" style={{ background: surfaceBg }}>
                <Text fw={800} c="red.7">
                  {t("product.loadError")}
                </Text>
                <Text size="sm" c="red.6" mt={4}>
                  {error instanceof Error ? error.message : t("common.unknownError")}
                </Text>
              </Paper>
            ) : null}

            {!isLoading && !isError && activeProduct ? (
              <>
                <Paper
                  radius={18}
                  p="md"
                  style={{
                    background: pageGradient,
                    border: cardBorder,
                    boxShadow: isDark
                      ? "0 8px 22px rgba(0, 0, 0, 0.22)"
                      : "0 12px 28px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <Image
                    src={activeProduct.image_url}
                    alt={getLocalizedValue(
                      activeProduct.name_uz,
                      activeProduct.name_ru,
                    )}
                    h={260}
                    fit="contain"
                    fallbackSrc="https://placehold.co/720x520/ffffff/222222?text=Food"
                  />
                </Paper>

                <Stack gap={10} pb={140}>
                  <Title order={2} c={titleColor}>
                    {getLocalizedValue(
                      activeProduct.name_uz,
                      activeProduct.name_ru,
                    )}
                  </Title>
                  <Text mb="sm" c={textColor}>
                    {activeProduct.description || t("menu.productFallbackDescription")}
                  </Text>

                  <Paper
                    radius="xl"
                    p="xs"
                    style={{
                      background: surfaceBg,
                      border: cardBorder,
                    }}
                  >
                    <Group justify="space-between" align="center" wrap="nowrap">
                      <Text fw={700} c={textColor}>
                        {t("product.quantity")}
                      </Text>
                      <Group gap="xs" wrap="nowrap">
                        <ActionIcon
                          radius="xl"
                          variant="light"
                          color="orange"
                          onClick={decreaseCount}
                          disabled={count <= 1}
                        >
                          <IconMinus size={16} />
                        </ActionIcon>
                        <Text
                          fw={900}
                          fz="1.05rem"
                          c={titleColor}
                          w={30}
                          ta="center"
                        >
                          {count}
                        </Text>
                        <ActionIcon
                          radius="xl"
                          variant="filled"
                          color="orange"
                          onClick={increaseCount}
                        >
                          <IconPlus size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>

                  {activeProductCartCount > 0 ? (
                    <Text size="sm" c={textColor}>
                      {t("product.inCart", { count: activeProductCartCount })}
                    </Text>
                  ) : null}

                  {!activeProduct.is_available ? (
                    <Text size="sm" fw={800} c="#df4b41" tt="uppercase">
                      {t("product.closed")}
                    </Text>
                  ) : null}
                </Stack>

                <Box
                  style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 220,
                    padding: "0 12px calc(10px + env(safe-area-inset-bottom)) 12px",
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Paper
                    radius={18}
                    p="sm"
                    style={{
                      width: "100%",
                      maxWidth: TELEGRAM_MOBILE_WIDTH,
                      background: surfaceBg,
                      border: cardBorder,
                      boxShadow: isDark
                        ? "0 10px 24px rgba(0,0,0,0.3)"
                        : "0 8px 20px rgba(15, 23, 42, 0.08)",
                      pointerEvents: "auto",
                    }}
                  >
                    <Group justify="space-between" align="center" wrap="nowrap">
                      <Stack gap={0}>
                        <Text size="xs" c={textColor}>
                          {t("cart.total")}
                        </Text>
                        <Text fw={900} fz="1.1rem" c={titleColor}>
                          {formatPrice(activeProduct.price * count)}
                        </Text>
                      </Stack>
                      <Paper
                        component="button"
                        type="button"
                        radius="xl"
                        px="lg"
                        py="sm"
                        onClick={submitSelection}
                        disabled={!activeProduct.is_available}
                        style={{
                          cursor: activeProduct.is_available
                            ? "pointer"
                            : "not-allowed",
                          border: "none",
                          color: "#ffffff",
                          fontWeight: 800,
                          background: activeProduct.is_available
                            ? "linear-gradient(135deg, #f78f26 0%, #ef6c00 100%)"
                            : "#a7abb3",
                        }}
                      >
                        {t("product.addToCart")}
                      </Paper>
                    </Group>
                  </Paper>
                </Box>
              </>
            ) : null}

            {!isLoading && !isError && !activeProduct ? (
              <Paper radius={20} p="lg" style={{ background: surfaceBg }}>
                <Text fw={800} c={titleColor}>
                  {t("product.notFoundTitle")}
                </Text>
                <Text size="sm" c={textColor} mt={4}>
                  {t("product.notFoundDescription")}
                </Text>
              </Paper>
            ) : null}
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
