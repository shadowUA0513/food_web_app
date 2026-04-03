import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";
import { useCartStore } from "../../../shared/store/cart-store";
import { formatPrice } from "../../../widgets/home-screen/ui/home-utils";

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const computedColorScheme = useComputedColorScheme("light");
  const cartItems = useCartStore((state) => state.items);

  const locale = i18n.resolvedLanguage === "uz" ? "uz" : "ru";
  const cartList = useMemo(() => Object.values(cartItems), [cartItems]);
  const cartTotalPrice = useMemo(
    () => cartList.reduce((sum, item) => sum + item.product.price * item.count, 0),
    [cartList],
  );

  const isDark = computedColorScheme === "dark";
  const pageBg = isDark ? "#111318" : "#f3f4f6";
  const surfaceBg = isDark ? "#181b21" : "#ffffff";
  const titleColor = isDark ? "#f3f4f6" : "#151515";
  const textColor = isDark ? "#b4bcc8" : "#5f6670";
  const mutedBg = isDark ? "#20242c" : "#f8f9fb";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(17,24,39,0.08)";

  function getLocalizedValue(nameUz: string, nameRu: string) {
    return locale === "uz" ? nameUz || nameRu : nameRu || nameUz;
  }

  function goBack() {
    navigate({
      pathname: cartList.length > 0 ? "/cart" : "/",
      search: location.search,
    });
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
                  {t("checkout.title")}
                </Text>
                <Box w={38} />
              </Group>
            </Paper>

            {cartList.length === 0 ? (
              <Paper
                radius={20}
                p="lg"
                style={{
                  background: surfaceBg,
                  border: cardBorder,
                }}
              >
                <Stack gap="sm">
                  <Title order={3} c={titleColor}>
                    {t("checkout.emptyTitle")}
                  </Title>
                  <Text size="sm" c={textColor}>
                    {t("checkout.emptyDescription")}
                  </Text>
                  <Button radius="xl" color="orange" onClick={goBack}>
                    {t("checkout.backToMenu")}
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <>
                <Paper
                  radius={20}
                  p="lg"
                  style={{
                    background: surfaceBg,
                    border: cardBorder,
                  }}
                >
                  <Stack gap={4}>
                    <Text size="sm" fw={700} c="orange.6">
                      {t("checkout.subtitle")}
                    </Text>
                    <Title order={2} c={titleColor}>
                      {t("checkout.orderDetails")}
                    </Title>
                    <Text size="sm" c={textColor}>
                      {t("checkout.description")}
                    </Text>
                  </Stack>
                </Paper>

                <Paper
                  radius={20}
                  p="lg"
                  style={{
                    background: surfaceBg,
                    border: cardBorder,
                  }}
                >
                  <Stack gap="md">
                    <Title order={4} c={titleColor}>
                      {t("checkout.contactTitle")}
                    </Title>
                    <TextInput
                      label={t("checkout.nameLabel")}
                      placeholder={t("checkout.namePlaceholder")}
                      leftSection={<IconUser size={16} />}
                      radius="md"
                    />
                    <TextInput
                      label={t("checkout.phoneLabel")}
                      placeholder={t("checkout.phonePlaceholder")}
                      leftSection={<IconPhone size={16} />}
                      radius="md"
                    />
                    <TextInput
                      label={t("checkout.addressLabel")}
                      placeholder={t("checkout.addressPlaceholder")}
                      leftSection={<IconMapPin size={16} />}
                      radius="md"
                    />
                    <Textarea
                      label={t("checkout.commentLabel")}
                      placeholder={t("checkout.commentPlaceholder")}
                      minRows={3}
                      radius="md"
                    />
                  </Stack>
                </Paper>

                <Paper
                  radius={20}
                  p="lg"
                  style={{
                    background: surfaceBg,
                    border: cardBorder,
                  }}
                >
                  <Stack gap="md">
                    <Title order={4} c={titleColor}>
                      {t("checkout.summaryTitle")}
                    </Title>

                    {cartList.map(({ product, count }) => (
                      <Group key={product.id} justify="space-between" align="flex-start">
                        <Stack gap={2}>
                          <Text fw={700} c={titleColor}>
                            {getLocalizedValue(product.name_uz, product.name_ru)}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {t("checkout.itemCount", { count })}
                          </Text>
                        </Stack>
                        <Text fw={800} c={titleColor}>
                          {formatPrice(product.price * count)}
                        </Text>
                      </Group>
                    ))}

                    <Divider color={isDark ? "dark.3" : "gray.3"} />

                    <Group
                      justify="space-between"
                      p="md"
                      style={{
                        background: mutedBg,
                        borderRadius: 16,
                      }}
                    >
                      <Text fw={800} c={titleColor}>
                        {t("checkout.total")}
                      </Text>
                      <Text fw={900} fz="1.1rem" c={titleColor}>
                        {formatPrice(cartTotalPrice)}
                      </Text>
                    </Group>

                    <Button
                      size="md"
                      radius="xl"
                      color="orange"
                      styles={{
                        root: {
                          height: 50,
                          fontWeight: 800,
                        },
                      }}
                    >
                      {t("checkout.confirmOrder")}
                    </Button>
                  </Stack>
                </Paper>
              </>
            )}
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
