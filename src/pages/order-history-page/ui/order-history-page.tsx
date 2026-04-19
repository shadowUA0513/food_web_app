import {
  ActionIcon,
  AppShell,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import { IconArrowLeft, IconClockHour4 } from "@tabler/icons-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBrandTheme } from "../../../app/providers/brand-theme-context";
import { useCompanyOrderHistory } from "../../../service/order";
import { useTelegramUser } from "../../../service/telegram-user";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";
import {
  formatPrice,
  getCompanyId,
  getPartnerId,
  getTelegramId,
} from "../../../widgets/home-screen/ui/home-utils";

export function OrderHistoryPage() {
  const { t } = useTranslation();
  const { brandColor } = useBrandTheme();
  const computedColorScheme = useComputedColorScheme("light");
  const navigate = useNavigate();
  const location = useLocation();

  const companyId = getCompanyId();
  const partnerId = getPartnerId();
  const telegramId = getTelegramId();
  const { data: telegramUser } = useTelegramUser(telegramId);
  const historyUserId =
    telegramUser?.TgID ?? (telegramId ? Number(telegramId) : undefined);
  const { data: orders = [], isLoading, isError, error } =
    useCompanyOrderHistory({
      companyId,
      partnerId,
      userId: Number.isFinite(historyUserId) ? historyUserId : undefined,
    });

  const isDark = computedColorScheme === "dark";
  const pageBg = isDark ? "#111318" : "#f3f4f6";
  const surfaceBg = isDark ? "#181b21" : "#ffffff";
  const titleColor = isDark ? "#f3f4f6" : "#151515";
  const textColor = isDark ? "#b4bcc8" : "#5f6670";
  const mutedBg = isDark ? "#20242c" : "#f8f9fb";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(17,24,39,0.08)";

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
        const rightTime = right.created_at
          ? new Date(right.created_at).getTime()
          : 0;

        return rightTime - leftTime;
      }),
    [orders],
  );

  function goBack() {
    navigate({
      pathname: "/",
      search: location.search,
    });
  }

  function formatOrderDate(value?: string | null) {
    if (!value) {
      return t("history.unknownDate");
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getOrderTitle(orderId: string, index: number) {
    const compactId = orderId.trim();

    if (compactId) {
      return `${t("history.order")} #${compactId.slice(0, 8)}`;
    }

    return `${t("history.order")} ${index + 1}`;
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
                  {t("history.title")}
                </Text>
                <Box w={38} />
              </Group>
            </Paper>

            {isLoading ? (
              <Paper
                radius={20}
                p="lg"
                style={{ background: surfaceBg, border: cardBorder }}
              >
                <Center py="md">
                  <Loader color={brandColor} />
                </Center>
              </Paper>
            ) : null}

            {isError ? (
              <Paper
                radius={20}
                p="lg"
                style={{ background: surfaceBg, border: cardBorder }}
              >
                <Text fw={800} c="red.7">
                  {t("history.loadError")}
                </Text>
                <Text size="sm" c="red.6" mt={4}>
                  {error instanceof Error ? error.message : t("common.unknownError")}
                </Text>
              </Paper>
            ) : null}

            {!isLoading && !isError && sortedOrders.length === 0 ? (
              <Paper
                radius={20}
                p="lg"
                style={{ background: surfaceBg, border: cardBorder }}
              >
                <Stack gap={8} align="center" py="md">
                  <Box
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: mutedBg,
                    }}
                  >
                    <IconClockHour4 size={26} color={brandColor} />
                  </Box>
                  <Title order={4} c={titleColor} ta="center">
                    {t("history.emptyTitle")}
                  </Title>
                  <Text size="sm" c={textColor} ta="center">
                    {t("history.emptyDescription")}
                  </Text>
                </Stack>
              </Paper>
            ) : null}

            {!isLoading && !isError
              ? sortedOrders.map((order, index) => (
                  <Paper
                    key={order.id || `${order.created_at ?? "order"}-${index}`}
                    radius={20}
                    p="lg"
                    style={{
                      background: surfaceBg,
                      border: cardBorder,
                    }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Stack gap={4} style={{ minWidth: 0 }}>
                          <Text fw={800} c={titleColor} truncate>
                            {getOrderTitle(order.id, index)}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {formatOrderDate(order.created_at)}
                          </Text>
                        </Stack>
                        <Paper
                          radius="xl"
                          px="sm"
                          py={6}
                          style={{
                            background: mutedBg,
                            border: cardBorder,
                            flexShrink: 0,
                          }}
                        >
                          <Text size="xs" fw={800} c={titleColor} tt="uppercase">
                            {order.status || t("history.statusUnknown")}
                          </Text>
                        </Paper>
                      </Group>

                      <Stack gap={8}>
                        <Group justify="space-between" wrap="nowrap" align="flex-start">
                          <Text size="sm" c={textColor}>
                            {t("history.paymentType")}
                          </Text>
                          <Text size="sm" fw={700} c={titleColor} ta="right">
                            {order.payment_type || t("history.notSpecified")}
                          </Text>
                        </Group>

                        <Group justify="space-between" wrap="nowrap" align="flex-start">
                          <Text size="sm" c={textColor}>
                            {t("history.deliveryAddress")}
                          </Text>
                          <Text size="sm" fw={700} c={titleColor} ta="right">
                            {order.delivery_address || t("history.notSpecified")}
                          </Text>
                        </Group>

                        <Group justify="space-between" wrap="nowrap" align="flex-start">
                          <Text size="sm" c={textColor}>
                            {t("history.itemsCount")}
                          </Text>
                          <Text size="sm" fw={700} c={titleColor} ta="right">
                            {order.items.length}
                          </Text>
                        </Group>

                        {typeof order.total_amount === "number" ? (
                          <Group justify="space-between" wrap="nowrap" align="flex-start">
                            <Text size="sm" c={textColor}>
                              {t("history.total")}
                            </Text>
                            <Text size="sm" fw={800} c={titleColor} ta="right">
                              {formatPrice(order.total_amount)}
                            </Text>
                          </Group>
                        ) : null}
                      </Stack>

                      {order.items.length > 0 ? (
                        <Stack gap={8}>
                          <Text size="sm" fw={800} c={titleColor}>
                            {t("history.items")}
                          </Text>
                          {order.items.map((item, itemIndex) => (
                            <Group
                              key={`${item.product_id || item.name || "item"}-${itemIndex}`}
                              justify="space-between"
                              align="flex-start"
                              wrap="nowrap"
                              style={{
                                background: mutedBg,
                                borderRadius: 14,
                                padding: "10px 12px",
                              }}
                            >
                              <Stack gap={2} style={{ minWidth: 0 }}>
                                <Text size="sm" fw={700} c={titleColor} truncate>
                                  {item.name || `${t("history.item")} ${itemIndex + 1}`}
                                </Text>
                                <Text size="xs" c={textColor}>
                                  {t("history.quantity")}: {item.quantity}
                                </Text>
                              </Stack>
                              {typeof item.price === "number" ? (
                                <Text size="sm" fw={800} c={titleColor} ta="right">
                                  {formatPrice(item.price)}
                                </Text>
                              ) : null}
                            </Group>
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </Paper>
                ))
              : null}
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
