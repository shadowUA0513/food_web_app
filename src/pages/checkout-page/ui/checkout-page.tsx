import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconCheck,
  IconCash,
  IconInfoCircle,
  IconX,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBrandTheme } from "../../../app/providers/brand-theme-context";
import { hexToRgba } from "../../../app/theme/theme";
import { useCreateCompanyOrder } from "../../../service/order";
import { useCompanyPartners } from "../../../service/partners";
import { useCompanySettings } from "../../../service/settings";
import { useTelegramUser } from "../../../service/telegram-user";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";
import { showAppNotification } from "../../../shared/lib/notifications";
import { useCartStore } from "../../../shared/store/cart-store";
import { SettingsDrawer } from "../../../widgets/home-screen/ui/components/settings-drawer";
import {
  formatPrice,
  getCompanyId,
  getDiscountedPrice,
  getPartnerId,
  getTelegramId,
} from "../../../widgets/home-screen/ui/home-utils";
import type { CreateOrderPayload } from "../../../types/order";
import type { Locale } from "../../../widgets/home-screen/ui/home-screen-types";
import type { Partner } from "../../../types/partner";
import clickLogo from "../../../assets/click.png";
import paymeLogo from "../../../assets/payme.png";
import { DeliveryAddressPicker } from "./delivery-address-picker";
import { PartnerMapPicker } from "./partner-map-picker";

type OrderType = "delivery-to-organization" | "delivery-anywhere";
type PaymentType = "payme" | "click" | "cash";

const DEFAULT_SUPPORTED_ORDER_TYPES: OrderType[] = [
  "delivery-to-organization",
  "delivery-anywhere",
];

export function CheckoutPage() {
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [partnersOpened, { open: openPartners, close: closePartners }] =
    useDisclosure(false);
  const [partnerView, setPartnerView] = useState<"map" | "list">("map");
  const { t, i18n } = useTranslation();
  const { brandColor, brandScale } = useBrandTheme();
  const { setColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const computedColorScheme = useComputedColorScheme("light");
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [comment, setComment] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("cash");
  const companyId = getCompanyId();
  const initialPartnerId = getPartnerId();
  const telegramId = getTelegramId();
  const { data: settings } = useCompanySettings(companyId);
  const [orderType, setOrderType] = useState<OrderType>(
    initialPartnerId ? "delivery-to-organization" : "delivery-anywhere",
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    initialPartnerId ?? "",
  );
  const createOrderMutation = useCreateCompanyOrder();
  const { data: telegramUser } = useTelegramUser(telegramId);
  const {
    data: partners = [],
    isLoading: isPartnersLoading,
    isError: isPartnersError,
    error: partnersError,
  } = useCompanyPartners(companyId);

  const locale: Locale = i18n.resolvedLanguage === "uz" ? "uz" : "ru";
  const cartList = useMemo(() => Object.values(cartItems), [cartItems]);
  const cartTotalPrice = useMemo(
    () =>
      cartList.reduce(
        (sum, item) => sum + getDiscountedPrice(item.product) * item.count,
        0,
      ),
    [cartList],
  );
  const supportedOrderTypes = useMemo(() => {
    const apiTypes = settings?.supported_order_types?.filter(
      (type): type is OrderType =>
        type === "delivery-to-organization" || type === "delivery-anywhere",
    );

    return apiTypes && apiTypes.length > 0
      ? apiTypes
      : DEFAULT_SUPPORTED_ORDER_TYPES;
  }, [settings?.supported_order_types]);
  const minOrderAmount = settings?.min_order_amount ?? 0;
  const isBelowMinOrderAmount = cartTotalPrice < minOrderAmount;
  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === selectedPartnerId) ?? null,
    [partners, selectedPartnerId],
  );
  const selectedOrderTypeSupported = supportedOrderTypes.includes(orderType);

  useEffect(() => {
    if (!selectedOrderTypeSupported) {
      setOrderType(supportedOrderTypes[0]);
    }
  }, [orderType, selectedOrderTypeSupported, supportedOrderTypes]);

  const isDark = computedColorScheme === "dark";
  const pageBg = isDark ? "#111318" : "#f3f4f6";
  const surfaceBg = isDark ? "#181b21" : "#ffffff";
  const titleColor = isDark ? "#f3f4f6" : "#151515";
  const textColor = isDark ? "#b4bcc8" : "#5f6670";
  const mutedBg = isDark ? "#20242c" : "#f8f9fb";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(17,24,39,0.08)";
  const paymentOptions: Array<{
    value: PaymentType;
    label: string;
    logo?: string;
  }> = [
    {
      value: "payme",
      label: "Payme",
      logo: paymeLogo,
    },
    {
      value: "click",
      label: "Click",
      logo: clickLogo,
    },
    {
      value: "cash",
      label: t("checkout.paymentCash"),
    },
  ];

  function getLocalizedValue(nameUz: string, nameRu: string) {
    return locale === "uz" ? nameUz || nameRu : nameRu || nameUz;
  }

  function getPartnerLabel(partner: Partner) {
    return (
      getLocalizedValue(partner.name_uz ?? "", partner.name_ru ?? "") ||
      partner.name ||
      partner.full_name ||
      partner.title ||
      ""
    );
  }

  function getPartnerSubtitle(partner: Partner) {
    return (
      partner.address_description ||
      partner.addressDescription ||
      partner.phone ||
      partner.phone_number ||
      ""
    );
  }

  function goBack() {
    navigate({
      pathname: cartList.length > 0 ? "/cart" : "/",
      search: location.search,
    });
  }

  function openOrderHistoryPage() {
    closeSettings();
    navigate({
      pathname: "/order-history",
      search: location.search,
    });
  }

  async function handleSubmitOrder() {
    if (!selectedOrderTypeSupported) {
      showAppNotification({
        title: t("checkout.submitErrorTitle"),
        message: t("common.unknownError"),
        color: "red",
        icon: <IconX size={18} />,
      });
      return;
    }

    if (isBelowMinOrderAmount) {
      showAppNotification({
        title: t("checkout.submitErrorTitle"),
        message: t("checkout.minOrderAmountError", {
          amount: formatPrice(minOrderAmount),
        }),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return;
    }

    const partnerId =
      orderType === "delivery-to-organization" ? selectedPartnerId : undefined;

    if (orderType === "delivery-to-organization" && !partnerId) {
      showAppNotification({
        title: t("checkout.missingPartner"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return;
    }

    if (orderType === "delivery-anywhere" && !deliveryAddress.trim()) {
      showAppNotification({
        title: t("checkout.validationAddress"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return;
    }

    if (!telegramUser?.TgID) {
      showAppNotification({
        title: t("checkout.missingUser"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return;
    }

    const orderPayload: CreateOrderPayload = {
      company_id: companyId,
      delivery_address:
        orderType === "delivery-anywhere" ? deliveryAddress.trim() : "",
      user_id: telegramUser.TgID,
      payment_type: paymentType,
      comment: comment.trim() || undefined,
      items: cartList.map(({ product, count }) => ({
        product_id: product.id,
        quantity: count,
        price: getDiscountedPrice(product),
      })),
    };

    if (partnerId) {
      orderPayload.partner_id = partnerId;
    }

    try {
      await createOrderMutation.mutateAsync(orderPayload);

      clearCart();
      showAppNotification({
        title: t("checkout.submitSuccessTitle"),
        message: t("checkout.submitSuccessMessage"),
        color: "green",
        icon: <IconCheck size={18} />,
      });
      navigate({
        pathname: "/",
        search: location.search,
      });
    } catch (error) {
      showAppNotification({
        title: t("checkout.submitErrorTitle"),
        message:
          error instanceof Error ? error.message : t("common.unknownError"),
        color: "red",
        icon: <IconX size={18} />,
      });
    }
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
        onToggleDarkMode={(enabled) =>
          setColorScheme(enabled ? "dark" : "light")
        }
        surfaceBg={surfaceBg}
        titleColor={titleColor}
        textColor={textColor}
        mutedBg={mutedBg}
        userName={telegramUser?.FullName}
        userSubtitle={
          telegramUser?.PhoneNumber ||
          (telegramUser?.Username ? `@${telegramUser.Username}` : undefined)
        }
        onOpenOrderHistory={openOrderHistoryPage}
      />

      <Drawer
        opened={partnersOpened}
        onClose={closePartners}
        position="bottom"
        size="100%"
        title={t("checkout.partnerDrawerTitle")}
        padding="lg"
        styles={{
          content: { background: surfaceBg },
          header: { background: surfaceBg, color: titleColor },
          title: { fontWeight: 800 },
          body: { background: surfaceBg },
        }}
      >
        <Stack gap="md">
          <Text size="sm" c={textColor}>
            {t("checkout.partnerDrawerDescription")}
          </Text>

          <SegmentedControl
            fullWidth
            radius="xl"
            color={brandColor}
            value={partnerView}
            onChange={(value) => setPartnerView(value as "map" | "list")}
            data={[
              { label: t("checkout.partnerMapView"), value: "map" },
              { label: t("checkout.partnerListView"), value: "list" },
            ]}
          />

          {isPartnersLoading ? (
            <Group justify="center" py="md">
              <Loader color={brandColor} />
            </Group>
          ) : null}

          {isPartnersError ? (
            <Paper
              radius={16}
              p="md"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            >
              <Text fw={800} c="red.7">
                {t("checkout.partnerLoadError")}
              </Text>
              <Text size="sm" c="red.6" mt={4}>
                {partnersError instanceof Error
                  ? partnersError.message
                  : t("common.unknownError")}
              </Text>
            </Paper>
          ) : null}

          {!isPartnersLoading && !isPartnersError && partners.length === 0 ? (
            <Paper
              radius={16}
              p="md"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            >
              <Text fw={700} c={titleColor}>
                {t("checkout.partnerEmpty")}
              </Text>
            </Paper>
          ) : null}

          {!isPartnersLoading && !isPartnersError && partnerView === "map" ? (
            <PartnerMapPicker
              partners={partners}
              selectedPartnerId={selectedPartnerId}
              onSelectPartner={(partnerId) => {
                setSelectedPartnerId(partnerId);
                closePartners();
              }}
              titleColor={titleColor}
              textColor={textColor}
              surfaceBg={surfaceBg}
              mutedBg={mutedBg}
              isDark={isDark}
            />
          ) : null}

          {!isPartnersLoading && !isPartnersError && partnerView === "list"
            ? partners.map((partner) => {
                const active = partner.id === selectedPartnerId;

                return (
                  <Paper
                    key={partner.id}
                    component="button"
                    type="button"
                    radius={18}
                    p="md"
                    onClick={() => {
                      setSelectedPartnerId(partner.id);
                      closePartners();
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      background: active ? mutedBg : surfaceBg,
                      border: active ? `1px solid ${brandColor}` : cardBorder,
                    }}
                  >
                    <Stack gap={4}>
                      <Text fw={800} c={titleColor}>
                        {getPartnerLabel(partner)}
                      </Text>
                      <Text size="xs" c={textColor}>
                        {getPartnerSubtitle(partner)}
                      </Text>
                    </Stack>
                  </Paper>
                );
              })
            : null}
        </Stack>
      </Drawer>

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
                <ActionIcon
                  size={38}
                  radius="xl"
                  variant="light"
                  color="gray"
                  onClick={openSettings}
                >
                  <IconUserCircle size={20} />
                </ActionIcon>
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
                  <Button radius="xl" color={brandColor} onClick={goBack}>
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
                  <Stack gap="md">
                    <Title order={4} c={titleColor}>
                      {t("checkout.orderTypeTitle")}
                    </Title>
                    <Group grow>
                      {supportedOrderTypes.includes(
                        "delivery-to-organization",
                      ) ? (
                        <Paper
                          component="button"
                          type="button"
                          radius={18}
                          p="xs"
                          onClick={() => {
                            setOrderType("delivery-to-organization");
                            setPartnerView("map");
                            openPartners();
                          }}
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            background:
                              orderType === "delivery-to-organization"
                                ? mutedBg
                                : surfaceBg,
                            border:
                              orderType === "delivery-to-organization"
                                ? `1px solid ${brandColor}`
                                : cardBorder,
                          }}
                        >
                          <Stack gap={4}>
                            <Text fw={800} c={titleColor}>
                              {t("checkout.orderTypePartners")}
                            </Text>
                          </Stack>
                        </Paper>
                      ) : null}

                      {supportedOrderTypes.includes("delivery-anywhere") ? (
                        <Paper
                          component="button"
                          type="button"
                          radius={18}
                          p="md"
                          onClick={() => setOrderType("delivery-anywhere")}
                          style={{
                            cursor: "pointer",
                            textAlign: "left",
                            background:
                              orderType === "delivery-anywhere"
                                ? mutedBg
                                : surfaceBg,
                            border:
                              orderType === "delivery-anywhere"
                                ? `1px solid ${brandColor}`
                                : cardBorder,
                          }}
                        >
                          <Stack gap={4}>
                            <Text
                              style={{ textAlign: "center" }}
                              fw={800}
                              c={titleColor}
                            >
                              {t("checkout.orderTypeMyself")}
                            </Text>
                          </Stack>
                        </Paper>
                      ) : null}
                    </Group>
                    {orderType === "delivery-to-organization" ? (
                      <Paper
                        radius={16}
                        p="md"
                        style={{
                          background: mutedBg,
                          border: cardBorder,
                        }}
                      >
                        <Stack gap="sm">
                          <Group justify="space-between" align="center">
                            <Stack gap={2}>
                              <Text size="sm" c={textColor}>
                                {t("checkout.selectedPartner")}
                              </Text>
                              <Text fw={800} c={titleColor}>
                                {selectedPartner
                                  ? getPartnerLabel(selectedPartner)
                                  : t("checkout.choosePartner")}
                              </Text>
                            </Stack>
                            <Button
                              variant="light"
                              color={brandColor}
                              radius="xl"
                              onClick={openPartners}
                            >
                              {t("checkout.choosePartner")}
                            </Button>
                          </Group>
                        </Stack>
                      </Paper>
                    ) : null}
                    {orderType === "delivery-anywhere" ? (
                      <DeliveryAddressPicker
                        value={deliveryAddress}
                        onChange={setDeliveryAddress}
                        titleColor={titleColor}
                        textColor={textColor}
                        surfaceBg={surfaceBg}
                        mutedBg={mutedBg}
                        isDark={isDark}
                      />
                    ) : null}
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
                      {t("checkout.paymentTitle")}
                    </Title>

                    <Group grow align="stretch">
                      {paymentOptions.map((option) => {
                        const active = paymentType === option.value;

                        return (
                          <Paper
                            key={option.value}
                            component="button"
                            type="button"
                            radius={18}
                            p="md"
                            onClick={() => setPaymentType(option.value)}
                            style={{
                              cursor: "pointer",
                              flex: 1,
                              minHeight: 108,
                              textAlign: "center",
                              background: active
                                ? hexToRgba(brandScale[1], isDark ? 0.22 : 0.55)
                                : mutedBg,
                              border: active
                                ? `1px solid ${brandColor}`
                                : isDark
                                  ? "1px solid rgba(255,255,255,0.06)"
                                  : "1px solid rgba(17,24,39,0.06)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Stack gap={10} align="center">
                              {option.logo ? (
                                <Box
                                  style={{
                                    width: 56,
                                    height: 40,
                                    display: "grid",
                                    placeItems: "center",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                  }}
                                >
                                  <img
                                    src={option.logo}
                                    alt={option.label}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 999,
                                    background: active
                                      ? brandColor
                                      : hexToRgba(brandScale[1], 0.45),
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <IconCash
                                    size={20}
                                    color={active ? "#ffffff" : brandColor}
                                  />
                                </Box>
                              )}
                              <Text fw={800} size="sm" c={titleColor}>
                                {option.label}
                              </Text>
                              <Box
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: active
                                    ? brandColor
                                    : "transparent",
                                  border: active
                                    ? `1px solid ${brandColor}`
                                    : isDark
                                      ? "1px solid rgba(255,255,255,0.16)"
                                      : "1px solid rgba(17,24,39,0.14)",
                                }}
                              />
                            </Stack>
                          </Paper>
                        );
                      })}
                    </Group>
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
                    <Textarea
                      label={t("checkout.commentLabel")}
                      placeholder={t("checkout.commentPlaceholder")}
                      minRows={3}
                      radius="md"
                      value={comment}
                      onChange={(event) =>
                        setComment(event.currentTarget.value)
                      }
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
                      <Group
                        key={product.id}
                        justify="space-between"
                        align="flex-start"
                      >
                        <Stack gap={2}>
                          <Text fw={700} c={titleColor}>
                            {getLocalizedValue(
                              product.name_uz,
                              product.name_ru,
                            )}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {t("checkout.itemCount", { count })}
                          </Text>
                        </Stack>
                        <Text fw={800} c={titleColor}>
                          {formatPrice(getDiscountedPrice(product) * count)}
                        </Text>
                      </Group>
                    ))}

                    <Divider color={isDark ? "dark.3" : "gray.3"} />

                    <Group
                      justify="space-between"
                      p="md"
                      style={{
                        background: hexToRgba(brandScale[1], 0.5),
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

                    {minOrderAmount > 0 ? (
                      <Text
                        size="sm"
                        c={isBelowMinOrderAmount ? "red.6" : textColor}
                      >
                        {t("checkout.minOrderAmountHint", {
                          amount: formatPrice(minOrderAmount),
                        })}
                      </Text>
                    ) : null}

                    <Button
                      size="md"
                      radius="xl"
                      color={brandColor}
                      onClick={handleSubmitOrder}
                      loading={createOrderMutation.isPending}
                      disabled={
                        createOrderMutation.isPending || isBelowMinOrderAmount
                      }
                      styles={{
                        root: {
                          height: 50,
                          fontWeight: 800,
                        },
                      }}
                    >
                      {createOrderMutation.isPending
                        ? t("checkout.submitPending")
                        : t("checkout.confirmOrder")}
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
