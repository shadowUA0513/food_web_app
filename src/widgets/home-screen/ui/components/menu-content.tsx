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
import { IconUserCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_MOBILE_WIDTH } from "../../../../shared/config/telegram";
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
  getLocalizedValue,
  formatPrice,
}: MenuContentProps) {
  const { t } = useTranslation();

  return (
    <Box mih="100dvh" bg={pageBg} px={12} py={14}>
      <Stack maw={TELEGRAM_MOBILE_WIDTH} mx="auto" gap="lg">
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

        <Group gap="xs" justify="space-between">
          <Text size="sm" fw={700} c={textColor}>
            {t("menu.categories")}
          </Text>
        </Group>

        {isLoading ? (
          <Center py="xl">
            <Loader color="orange" />
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

        {visibleCategories.map(({ category, products }) => (
          <Stack key={category.id} gap="sm">
            <Group justify="space-between" align="center" px={2}>
              <Title order={2} fz="1.05rem" fw={800} c={titleColor}>
                {getLocalizedValue(category.name_uz, category.name_ru)}
              </Title>
            </Group>

            <SimpleGrid cols={2} spacing={12} verticalSpacing={12}>
              {products.map((product) => (
                <Card
                  component="button"
                  type="button"
                  key={product.id}
                  onClick={() => onOpenProduct(product)}
                  radius={18}
                  p={0}
                  style={{
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    background: surfaceBg,
                    boxShadow: isDark
                      ? "0 8px 22px rgba(0, 0, 0, 0.22)"
                      : "0 2px 14px rgba(17, 24, 39, 0.05)",
                  }}
                >
                  <Box
                    px="sm"
                    pt="md"
                    pb={0}
                    style={{
                      minHeight: 116,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: mutedBg,
                    }}
                  >
                    <Image
                      src={product.image_url}
                      alt={getLocalizedValue(product.name_uz, product.name_ru)}
                      h={172}
                      fit="contain"
                      fallbackSrc="https://placehold.co/520x360/ffffff/222222?text=Food"
                    />
                  </Box>

                  <Stack gap={6} px="md" pb="md" pt="xs">
                    <Text
                      fw={800}
                      fz="0.98rem"
                      lh={1.15}
                      c={titleColor}
                      lineClamp={2}
                    >
                      {getLocalizedValue(product.name_uz, product.name_ru)}
                    </Text>

                    <Text
                      size="xs"
                      c={textColor}
                      lh={1.35}
                      lineClamp={3}
                      mih={48}
                    >
                      {product.description ||
                        t("menu.productFallbackDescription")}
                    </Text>

                    <Group justify="space-between" align="end" gap="xs" mt={2}>
                      <Text fw={900} fz="1.1rem" c={titleColor}>
                        {formatPrice(product.price)}
                      </Text>
                      {!product.is_available ? (
                        <Text size="10px" fw={800} c="#df4b41" tt="uppercase">
                          {t("product.closed")}
                        </Text>
                      ) : null}
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        ))}

        {!isLoading && !isError && visibleCategories.length === 0 ? (
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
