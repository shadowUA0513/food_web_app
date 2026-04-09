import {
  ActionIcon,
  Box,
  Card,
  Center,
  Group,
  Image,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconShoppingBagPlus, IconUserCircle } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBrandTheme } from "../../../../app/providers/brand-theme-context";
import { hexToRgba } from "../../../../app/theme/theme";
import { TELEGRAM_MOBILE_WIDTH } from "../../../../shared/config/telegram";
import { ProductImage } from "../../../../shared/lib/product-image";
import type { MenuCategoryWithProducts, Product } from "../../../../types/menu";
import type { CompanySettings } from "../../../../types/settings";
import type { Locale } from "../home-screen-types";

interface MenuContentProps {
  locale: Locale;
  settings?: CompanySettings;
  visibleCategories: MenuCategoryWithProducts[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isDark: boolean;
  pageBg: string;
  surfaceBg: string;
  titleColor: string;
  textColor: string;
  mutedBg: string;
  onOpenSettings: () => void;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  getLocalizedValue: (nameUz: string, nameRu: string) => string;
  formatPrice: (price: number) => string;
}

export function MenuContent({
  settings,
  visibleCategories,
  isLoading,
  isError,
  error,
  isDark,
  pageBg,
  surfaceBg,
  titleColor,
  textColor,
  mutedBg,
  onOpenSettings,
  onOpenProduct,
  onAddToCart,
  getLocalizedValue,
  formatPrice,
}: MenuContentProps) {
  const { t } = useTranslation();
  const { brandColor, brandScale } = useBrandTheme();
  const headerHeight = 104;
  const headerOffset = 14;
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const visibleCategoriesWithProducts = useMemo(
    () =>
      visibleCategories
        .map(({ category, products }) => ({
          category,
          products: products.filter((product) => {
            const maybeActive = product as Product & { is_active?: boolean };
            return product.is_available && maybeActive.is_active !== false;
          }),
        }))
        .filter(({ products }) => products.length > 0),
    [visibleCategories],
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    visibleCategoriesWithProducts[0]?.category.id ?? null,
  );

  useEffect(() => {
    setActiveCategoryId((current) => {
      if (
        current &&
        visibleCategoriesWithProducts.some(({ category }) => category.id === current)
      ) {
        return current;
      }

      return visibleCategoriesWithProducts[0]?.category.id ?? null;
    });
  }, [visibleCategoriesWithProducts]);

  function scrollToCategory(categoryId: string) {
    setActiveCategoryId(categoryId);

    const element = categoryRefs.current[categoryId];
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <Box mih="100dvh" bg={isDark ? pageBg : "#ffffff"} px={12} py={14}>
      <Stack maw={TELEGRAM_MOBILE_WIDTH} mx="auto" gap="lg">
        <Box
          style={{
            position: "fixed",
            top: headerOffset,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 24px)",
            maxWidth: TELEGRAM_MOBILE_WIDTH,
            zIndex: 120,
          }}
        >
          <Paper
            radius={24}
            p="md"
            style={{
              background: surfaceBg,
              border: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(255,255,255,0.85)",
              boxShadow: isDark
                ? "0 14px 34px rgba(0, 0, 0, 0.28)"
                : "0 12px 28px rgba(15, 23, 42, 0.06)",
              backdropFilter: "blur(18px)",
            }}
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                {settings?.logo_url ? (
                  <Image
                    src={settings.logo_url}
                    alt={settings.name}
                    w={44}
                    h={44}
                    radius="xl"
                    fit="cover"
                  />
                ) : null}
                <Stack gap={2}>
                  <Title order={1} fz="1.2rem" fw={900} lh={1.1} c={titleColor}>
                    {settings?.name ?? t("menu.titleFallback")}
                  </Title>
                  <Text size="sm" c={textColor}>
                    {t("menu.subtitle")}
                  </Text>
                </Stack>
              </Group>

              <ActionIcon
                size={42}
                radius="xl"
                variant="subtle"
                onClick={onOpenSettings}
                color={isDark ? "gray" : "dark"}
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(15,23,42,0.05)",
                }}
              >
                <IconUserCircle size={24} />
              </ActionIcon>
            </Group>
          </Paper>
        </Box>

        <Box h={headerHeight} />

        <Group gap="xs" justify="space-between">
          <Text size="sm" fw={700} c={textColor}>
            {t("menu.categories")}
          </Text>
        </Group>

        {!isLoading && !isError && visibleCategoriesWithProducts.length > 0 ? (
          <Box
            style={{
              overflowX: "auto",
              paddingBottom: 2,
              scrollbarWidth: "none",
            }}
          >
            <Group gap="xs" wrap="nowrap">
              {visibleCategoriesWithProducts.map(({ category }) => {
                const isActive = activeCategoryId === category.id;

                return (
                  <Paper
                    key={category.id}
                    component="button"
                    type="button"
                    px="sm"
                    py={8}
                    radius="xl"
                    onClick={() => scrollToCategory(category.id)}
                    style={{
                      cursor: "pointer",
                      border: isActive
                        ? `1px solid ${brandColor}`
                        : isDark
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid rgba(15,23,42,0.08)",
                      background: isActive
                        ? isDark
                          ? hexToRgba(brandColor, 0.16)
                          : hexToRgba(brandColor, 0.08)
                        : surfaceBg,
                      color: isActive ? brandColor : titleColor,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {getLocalizedValue(category.name_uz, category.name_ru)}
                  </Paper>
                );
              })}
            </Group>
          </Box>
        ) : null}

        {isLoading ? (
          <Center py="xl">
            <Loader color={brandColor} />
          </Center>
        ) : null}

        {isError ? (
          <Paper
            radius={24}
            p="lg"
            style={{
              background: isDark ? "#2a1616" : "#fff1f0",
              border: isDark
                ? "1px solid rgba(255,120,120,0.18)"
                : "1px solid #ffd7d2",
            }}
          >
            <Text fw={800} c="red.7">
              {t("menu.loadError")}
            </Text>
            <Text size="sm" c="red.6" mt={4}>
              {error instanceof Error
                ? error.message
                : t("common.unknownError")}
            </Text>
          </Paper>
        ) : null}

        {visibleCategoriesWithProducts.map(({ category, products }) => (
          <Stack
            key={category.id}
            gap="sm"
            ref={(node) => {
              categoryRefs.current[category.id] = node;
            }}
          >
            <Group justify="space-between" align="center" px={2}>
              <Title order={2} fz="1.05rem" fw={800} c={titleColor}>
                {getLocalizedValue(category.name_uz, category.name_ru)}
              </Title>
            </Group>

            <SimpleGrid cols={1} spacing={6} verticalSpacing={6}>
              {products.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => onOpenProduct(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpenProduct(product);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  p={8}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid #e7e8ec",
                    borderRadius: "0",
                    background: isDark ? "#111318" : "#ffffff",
                  }}
                >
                  <Group justify="center" align="center" gap="sm" wrap="nowrap">
                    <Box
                      style={{
                        width: 76,
                        minWidth: 76,
                        height: 76,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: mutedBg,
                        overflow: "hidden",
                      }}
                    >
                      <ProductImage
                        src={product.image_url}
                        alt={getLocalizedValue(
                          product.name_uz,
                          product.name_ru,
                        )}
                        h={76}
                        fit="contain"
                        background={`linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 100%), linear-gradient(135deg, ${brandScale[2]} 0%, ${brandColor} 48%, ${brandScale[7]} 100%)`}
                      />
                    </Box>

                    <Group
                      ml="4px"
                      justify="space-between"
                      align="center"
                      gap="sm"
                      wrap="nowrap"
                      style={{ flex: 1 }}
                    >
                      <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          fw={800}
                          fz="0.9rem"
                          lh={1.15}
                          c={titleColor}
                          lineClamp={1}
                        >
                          {getLocalizedValue(product.name_uz, product.name_ru)}
                        </Text>

                        <Box
                          px="sm"
                          py={5}
                          mt="4px"
                          style={{
                            width: "fit-content",
                            maxWidth: "100%",
                            borderRadius: 999,
                            background: isDark
                              ? "rgba(255,255,255,0.08)"
                              : "#f3f4f6",
                            boxShadow: isDark
                              ? "inset 0 0 0 1px rgba(255,255,255,0.04)"
                              : "inset 0 0 0 1px rgba(15,23,42,0.04)",
                          }}
                        >
                          <Text fw={900} fz="0.94rem" c={titleColor} lh={1}>
                            {formatPrice(product.price)}
                          </Text>
                        </Box>
                      </Stack>

                      <ActionIcon
                        size={34}
                        radius="xl"
                        variant={product.is_available ? "filled" : "light"}
                        color={brandColor}
                        disabled={!product.is_available}
                        aria-label={t("product.addToCart")}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (!product.is_available) {
                            return;
                          }

                          onAddToCart(product);
                        }}
                        style={{
                          boxShadow: product.is_available
                            ? isDark
                              ? `0 10px 18px ${hexToRgba(brandColor, 0.28)}`
                              : `0 10px 18px ${hexToRgba(brandColor, 0.22)}`
                            : "none",
                          flexShrink: 0,
                        }}
                      >
                        <IconShoppingBagPlus size={17} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        ))}

        {!isLoading &&
        !isError &&
        visibleCategoriesWithProducts.length === 0 ? (
          <Paper
            radius={24}
            p="lg"
            style={{
              background: surfaceBg,
              border: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(235, 235, 235, 0.95)",
              boxShadow: isDark
                ? "0 10px 28px rgba(0, 0, 0, 0.2)"
                : "0 10px 28px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Text fw={800} c={titleColor}>
              {t("menu.emptyTitle")}
            </Text>
            <Text size="sm" c={textColor} mt={4}>
              {t("menu.emptyDescription")}
            </Text>
          </Paper>
        ) : null}
      </Stack>
    </Box>
  );
}
