import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Divider,
  Drawer,
  FileButton,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconCheck,
  IconCash,
  IconChefHat,
  IconClock,
  IconCopy,
  IconCreditCard,
  IconFileDescription,
  IconHelpCircle,
  IconPhoto,
  IconInfoCircle,
  IconMotorbike,
  IconTrash,
  IconX,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBrandTheme } from "../../../app/providers/brand-theme-context";
import { hexToRgba } from "../../../app/theme/theme";
import {
  useCompanyCheckoutQuote,
  useCreateCompanyOrder,
} from "../../../service/order";
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
import type {
  CheckoutQuoteItemPayload,
  CreateOrderPayload,
  PromisedTimeRanges,
} from "../../../types/order";
import type { PaymentMethod } from "../../../types/settings";
import type { Locale } from "../../../widgets/home-screen/ui/home-screen-types";
import type { Partner } from "../../../types/partner";
import clickLogo from "../../../assets/click.png";
import paymeLogo from "../../../assets/payme.png";
import { DeliveryAddressPicker } from "./delivery-address-picker";
import { PartnerMapPicker } from "./partner-map-picker";

type OrderType = "delivery-to-organization" | "delivery-anywhere";
type PaymentType = PaymentMethod;

const DEFAULT_SUPPORTED_ORDER_TYPES: OrderType[] = [
  "delivery-to-organization",
  "delivery-anywhere",
];

interface OrderSuccessPanelProps {
  opened: boolean;
  startedAt: number;
  deliveryEstimatedTime?: number;
  promisedTimeRanges?: PromisedTimeRanges;
  isDark: boolean;
  onClose: () => void;
  onViewOrder: () => void;
}

function formatUtcTime(timestamp: string | number) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

function OrderSuccessContent({
  startedAt,
  deliveryEstimatedTime,
  promisedTimeRanges,
  isDark,
  secondsLeft,
  isMobile,
  onClose,
  onViewOrder,
}: Omit<OrderSuccessPanelProps, "opened" | "onClose"> & {
  secondsLeft: number;
  isMobile: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const fallbackPreparingEnd = startedAt + 5 * 60 * 1000;
  const fallbackDeliveryStart = startedAt + 15 * 60 * 1000;
  const fallbackDeliveryEnd =
    fallbackDeliveryStart + Math.max(deliveryEstimatedTime ?? 35, 20) * 60 * 1000;
  const preparingStart =
    promisedTimeRanges?.promised_ready_time_range?.from ?? startedAt;
  const preparingEnd =
    promisedTimeRanges?.promised_ready_time_range?.to ?? fallbackPreparingEnd;
  const deliveryStart =
    promisedTimeRanges?.promised_delivery_time_range?.from ??
    fallbackDeliveryStart;
  const deliveryEnd =
    promisedTimeRanges?.promised_delivery_time_range?.to ?? fallbackDeliveryEnd;
  const titleColor = isDark ? "#f5f7fa" : "#17202b";
  const textColor = isDark ? "#c7d0da" : "#5f6670";
  const cardBg = isDark ? "rgba(18, 29, 42, 0.5)" : "#ffffff";
  const cardBorder = isDark ? "#344557" : "#dfe4e8";
  const green = isDark ? "#52e798" : "#2b9d62";

  return (
    <Stack
      gap="md"
      align="stretch"
      px={4}
      pt={isMobile ? 26 : 6}
      pb={4}
      style={{ position: "relative" }}
    >
      <Box
        style={{
          position: "absolute",
          top: isMobile ? 2 : 4,
          right: 0,
          left: 0,
          display: "flex",
          justifyContent: "flex-end",
          pointerEvents: "none",
        }}
      >
        {isMobile ? (
          <Box
            w={42}
            h={4}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: 99,
              background: isDark ? "#7b8793" : "#b8bec4",
            }}
          />
        ) : null}
        <ActionIcon
          variant="subtle"
          color={isDark ? "gray.2" : "dark"}
          size={34}
          radius="xl"
          aria-label={t("common.close")}
          onClick={onClose}
          style={{ pointerEvents: "auto" }}
        >
          <IconX size={23} stroke={1.8} />
        </ActionIcon>
      </Box>
      <Box ta="center">
        <Box
          mx="auto"
          mb={15}
          w={72}
          h={72}
          style={{
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: isDark ? "#2b8a5d" : "#dff5e5",
            color: green,
          }}
        >
          <IconCheck size={38} stroke={2.6} />
        </Box>
        <Title order={2} c={titleColor} fz="1.35rem" lh={1.15}>
          {t("checkout.submitSuccessTitle")}
        </Title>
        <Text c={textColor} size="sm" mt={8} lh={1.35}>
          {t("checkout.submitSuccessMessage")}
        </Text>
      </Box>

      <Stack gap={8}>
        <SuccessTimeCard
          icon={<IconChefHat size={27} stroke={1.9} />}
          label={t("checkout.successPreparing")}
          time={`${formatUtcTime(preparingStart)} – ${formatUtcTime(preparingEnd)}`}
          cardBg={cardBg}
          cardBorder={cardBorder}
          green={green}
          textColor={textColor}
        />
        <SuccessTimeCard
          icon={<IconMotorbike size={29} stroke={1.9} />}
          label={t("checkout.successDelivery")}
          time={`${formatUtcTime(deliveryStart)} – ${formatUtcTime(deliveryEnd)}`}
          cardBg={cardBg}
          cardBorder={cardBorder}
          green={green}
          textColor={textColor}
        />
      </Stack>

      <Group justify="center" gap={7} mt={2}>
        <IconClock size={16} stroke={1.8} color={textColor} />
        <Text c={textColor} size="xs">
          {t("checkout.successUtc")}
        </Text>
      </Group>

      <Group justify="center" gap={10} mt={4}>
        <Box
          w={42}
          h={42}
          style={{
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            border: `3px solid ${green}`,
            color: titleColor,
            fontWeight: 800,
            fontSize: "0.9rem",
          }}
        >
          {secondsLeft}
        </Box>
        <Text c={titleColor} size="sm" fw={600}>
          {t("checkout.successClosing", { count: secondsLeft })}
        </Text>
      </Group>

      <Button
        variant="outline"
        color={green}
        radius="md"
        size="sm"
        mx="auto"
        onClick={onViewOrder}
        styles={{
          root: {
            color: titleColor,
            borderColor: cardBorder,
            minWidth: 126,
            fontWeight: 700,
          },
        }}
      >
        {t("checkout.successViewOrder")}
      </Button>
    </Stack>
  );
}

function SuccessTimeCard({
  icon,
  label,
  time,
  cardBg,
  cardBorder,
  green,
  textColor,
}: {
  icon: ReactNode;
  label: string;
  time: string;
  cardBg: string;
  cardBorder: string;
  green: string;
  textColor: string;
}) {
  return (
    <Group
      wrap="nowrap"
      gap="md"
      px="sm"
      py={12}
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 8,
        minHeight: 68,
      }}
    >
      <Box c={green} style={{ display: "grid", placeItems: "center" }}>
        {icon}
      </Box>
      <Stack gap={1}>
        <Text c={textColor} size="xs" lh={1.2}>
          {label}
        </Text>
        <Text c={green} fw={800} fz="1.05rem" lh={1.2}>
          {time}
        </Text>
      </Stack>
    </Group>
  );
}

function OrderSuccessPanel({
  opened,
  startedAt,
  deliveryEstimatedTime,
  promisedTimeRanges,
  isDark,
  onClose,
  onViewOrder,
}: OrderSuccessPanelProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!opened) {
      return;
    }

    setSecondsLeft(5);
    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    const timeoutId = window.setTimeout(onClose, 5000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [onClose, opened, startedAt]);

  const content = (
    <OrderSuccessContent
      startedAt={startedAt}
      deliveryEstimatedTime={deliveryEstimatedTime}
      promisedTimeRanges={promisedTimeRanges}
      isDark={isDark}
      secondsLeft={secondsLeft}
      isMobile={Boolean(isMobile)}
      onClose={onClose}
      onViewOrder={onViewOrder}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        position="bottom"
        size="auto"
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.72, blur: 3 }}
        styles={{
          content: {
            background: isDark ? "#182636" : "#ffffff",
            border: `2px solid ${isDark ? "#4c5c6b" : "#dfe4e8"}`,
            borderRadius: "28px 28px 0 0",
          },
          header: { display: "none" },
          body: { padding: "0 18px 18px" },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      size={330}
      overlayProps={{ backgroundOpacity: 0.72, blur: 3 }}
      styles={{
        content: {
          background: isDark ? "#182636" : "#ffffff",
          border: `1px solid ${isDark ? "#344557" : "#dfe4e8"}`,
          borderRadius: 18,
        },
        header: { display: "none" },
        body: { padding: "0 18px 20px" },
      }}
    >
      {content}
    </Modal>
  );
}

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
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("cash");
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState("");
  const [
    paymentProofOpened,
    { open: openPaymentProof, close: closePaymentProof },
  ] = useDisclosure(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null,
  );
  const [orderSuccessOpened, setOrderSuccessOpened] = useState(false);
  const [orderSuccessStartedAt, setOrderSuccessStartedAt] = useState(0);
  const [successDeliveryEstimatedTime, setSuccessDeliveryEstimatedTime] =
    useState<number | undefined>();
  const [successPromisedTimeRanges, setSuccessPromisedTimeRanges] =
    useState<PromisedTimeRanges | undefined>();
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

  const locale: Locale = i18n.resolvedLanguage === "uz"
    ? "uz"
    : i18n.resolvedLanguage === "en"
      ? "en"
      : "ru";
  const cartList = useMemo(() => Object.values(cartItems), [cartItems]);
  const cartTotalPrice = useMemo(
    () =>
      cartList.reduce(
        (sum, item) => sum + getDiscountedPrice(item.product) * item.count,
        0,
      ),
    [cartList],
  );
  const checkoutItemsPayload = useMemo<CheckoutQuoteItemPayload[]>(
    () =>
      cartList.map(({ product, count }) => ({
        product_id: product.id,
        quantity: count,
        price: getDiscountedPrice(product),
      })),
    [cartList],
  );
  const {
    data: checkoutQuote,
    isLoading: isCheckoutQuoteLoading,
    isError: isCheckoutQuoteError,
    error: checkoutQuoteError,
  } = useCompanyCheckoutQuote({
    companyId,
    payload: {
      items: checkoutItemsPayload,
      ...(orderType === "delivery-anywhere" && deliveryCoordinates
        ? {
            customer_lat: deliveryCoordinates.latitude,
            customer_long: deliveryCoordinates.longitude,
          }
        : {}),
    },
  });
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
  const allowedPaymentMethods = settings?.payment_accepting_style ?? ["cash"];
  const acceptsCash = allowedPaymentMethods.includes("cash");
  const acceptsPayme = allowedPaymentMethods.includes("payme");
  const acceptsClick = allowedPaymentMethods.includes("click");
  const acceptsCard = allowedPaymentMethods.includes("card");
  const cardPans = useMemo(
    () =>
      (settings?.card_pans ?? []).map((card) => card.trim()).filter(Boolean),
    [settings?.card_pans],
  );
  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === selectedPartnerId) ?? null,
    [partners, selectedPartnerId],
  );
  const selectedOrderTypeSupported = supportedOrderTypes.includes(orderType);
  const requiresPaymentProof = paymentType === "card";
  const requiresPaymentPhone =
    paymentType === "payme" || paymentType === "click";
  const summarySubtotal = checkoutQuote?.subtotal ?? cartTotalPrice;
  const summaryShippingCost = checkoutQuote?.shipping_cost ?? 0;
  const summaryFinalTotal = checkoutQuote?.final_total ?? cartTotalPrice;
  const deliveryEstimatedTime = checkoutQuote?.delivery_estimated_time;

  useEffect(() => {
    if (!selectedOrderTypeSupported) {
      setOrderType(supportedOrderTypes[0]);
    }
  }, [orderType, selectedOrderTypeSupported, supportedOrderTypes]);

  useEffect(() => {
    if (!paymentProofFile) {
      setPaymentProofPreview(null);
      return;
    }

    if (!paymentProofFile.type.startsWith("image/")) {
      setPaymentProofPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(paymentProofFile);
    setPaymentProofPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [paymentProofFile]);

  useEffect(() => {
    if (!telegramUser?.PhoneNumber) {
      return;
    }

    setPaymentPhoneNumber((current) =>
      current.trim() ? current : telegramUser.PhoneNumber.trim(),
    );
  }, [telegramUser?.PhoneNumber]);

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
    ...(acceptsPayme
      ? [
          {
            value: "payme" as const,
            label: "Payme",
            logo: paymeLogo,
          },
        ]
      : []),
    ...(acceptsClick
      ? [
          {
            value: "click" as const,
            label: "Click",
            logo: clickLogo,
          },
        ]
      : []),
    ...(acceptsCash
      ? [
          {
            value: "cash" as const,
            label: t("checkout.paymentCash"),
          },
        ]
      : []),
    ...(acceptsCard && cardPans.length > 0
      ? [
          {
            value: "card" as const,
            label: t("checkout.paymentCard"),
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (!paymentOptions.some((option) => option.value === paymentType)) {
      setPaymentType(paymentOptions[0]?.value ?? "cash");
    }
  }, [paymentOptions, paymentType]);

  function getLocalizedValue(nameUz: string, nameRu: string, nameEn?: string) {
    return locale === "uz"
      ? nameUz || nameRu || nameEn || ""
      : locale === "en"
        ? nameEn || nameRu || nameUz || ""
        : nameRu || nameUz || nameEn || "";
  }

  function formatDeliveryEstimatedTime(minutes?: number | null) {
    if (!Number.isFinite(minutes) || !minutes || minutes <= 0) {
      return null;
    }

    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (locale === "uz") {
      if (hours > 0 && remainingMinutes > 0) {
        return `${hours} soat ${remainingMinutes} daqiqa`;
      }

      if (hours > 0) {
        return `${hours} soat`;
      }

      return `${remainingMinutes} daqiqa`;
    }

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} ч ${remainingMinutes} мин`;
    }

    if (hours > 0) {
      return `${hours} ч`;
    }

    return `${remainingMinutes} мин`;
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

  function closeOrderSuccess() {
    setOrderSuccessOpened(false);
    navigate({
      pathname: "/",
      search: location.search,
    });
  }

  function viewOrderFromSuccess() {
    setOrderSuccessOpened(false);
    navigate({
      pathname: "/order-history",
      search: location.search,
    });
  }

  function validateOrderBeforeSubmit() {
    if (!selectedOrderTypeSupported) {
      showAppNotification({
        title: t("checkout.submitErrorTitle"),
        message: t("common.unknownError"),
        color: "red",
        icon: <IconX size={18} />,
      });
      return false;
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
      return false;
    }

    const partnerId =
      orderType === "delivery-to-organization" ? selectedPartnerId : undefined;

    if (orderType === "delivery-to-organization" && !partnerId) {
      showAppNotification({
        title: t("checkout.missingPartner"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return false;
    }

    if (orderType === "delivery-anywhere" && !deliveryAddress.trim()) {
      showAppNotification({
        title: t("checkout.validationAddress"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return false;
    }

    if (!telegramUser?.TgID) {
      showAppNotification({
        title: t("checkout.missingUser"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return false;
    }

    if (requiresPaymentPhone && !paymentPhoneNumber.trim()) {
      showAppNotification({
        title: t("checkout.validationPhone"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return false;
    }

    return true;
  }

  async function submitOrder() {
    if (!validateOrderBeforeSubmit()) {
      return;
    }

    const telegramUserId = telegramUser?.TgID;
    const partnerId =
      orderType === "delivery-to-organization" ? selectedPartnerId : undefined;

    if (!telegramUserId) {
      return;
    }

    const orderPayload: CreateOrderPayload = {
      company_id: companyId,
      delivery_address:
        orderType === "delivery-anywhere" ? deliveryAddress.trim() : "",
      user_id: telegramUserId,
      phone_number: (
        requiresPaymentPhone
          ? paymentPhoneNumber
          : telegramUser?.PhoneNumber ?? paymentPhoneNumber
      ).trim() || undefined,
      payment_type: paymentType === "card" ? "card" : paymentType,
      comment: comment.trim() || undefined,
      items: checkoutItemsPayload,
    };

    if (partnerId) {
      orderPayload.partner_id = partnerId;
    }

    try {
      const createdOrder = await createOrderMutation.mutateAsync({
        payload: orderPayload,
        file: paymentProofFile,
      });

      clearCart();
      setPaymentProofFile(null);
      setSuccessDeliveryEstimatedTime(deliveryEstimatedTime);
      setSuccessPromisedTimeRanges(createdOrder?.promised_time_ranges);
      setOrderSuccessStartedAt(Date.now());
      setOrderSuccessOpened(true);
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

  async function handlePaymentProofSelect(file: File | null) {
    if (!file) {
      return;
    }

    setPaymentProofFile(file);
  }

  function handleOrderButtonClick() {
    if (!validateOrderBeforeSubmit()) {
      return;
    }

    if (requiresPaymentProof) {
      openPaymentProof();
      return;
    }

    void submitOrder();
  }

  function handleConfirmPaymentProof() {
    if (!paymentProofFile) {
      showAppNotification({
        title: t("checkout.paymentProofRequiredTitle"),
        message: t("checkout.paymentProofRequiredMessage"),
        color: "red",
        icon: <IconInfoCircle size={18} />,
      });
      return;
    }

    closePaymentProof();
    void submitOrder();
  }

  function handleClosePaymentProof() {
    closePaymentProof();
  }

  async function handleCopyCardPan(cardPan: string) {
    try {
      await navigator.clipboard.writeText(cardPan);
      showAppNotification({
        title: t("checkout.paymentCardCopiedTitle"),
        message: t("checkout.paymentCardCopiedMessage"),
        color: "green",
        icon: <IconCheck size={18} />,
      });
    } catch {
      showAppNotification({
        title: t("checkout.submitErrorTitle"),
        message: t("common.unknownError"),
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  }

  return (
    <>
      <OrderSuccessPanel
        opened={orderSuccessOpened}
        startedAt={orderSuccessStartedAt}
        deliveryEstimatedTime={successDeliveryEstimatedTime}
        promisedTimeRanges={successPromisedTimeRanges}
        isDark={isDark}
        onClose={closeOrderSuccess}
        onViewOrder={viewOrderFromSuccess}
      />
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
        phoneNumbers={settings?.phone_numbers}
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

      <Modal
        opened={paymentProofOpened}
        onClose={handleClosePaymentProof}
        centered
        radius="lg"
        title={t("checkout.paymentProofModalTitle")}
        styles={{
          content: { background: surfaceBg },
          header: { background: surfaceBg, color: titleColor },
          title: { fontWeight: 800 },
          body: { background: surfaceBg },
        }}
      >
        <Stack gap="md">
          <Text size="sm" c={textColor}>
            {t("checkout.paymentProofModalDescription")}
          </Text>

          {paymentProofPreview ? (
            <Image
              src={paymentProofPreview}
              alt={t("checkout.paymentProofPreviewAlt")}
              radius="md"
              h={220}
              fit="contain"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            />
          ) : paymentProofFile ? (
            <Paper
              radius={16}
              p="xl"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            >
              <Stack gap="xs" align="center">
                <Box
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: hexToRgba(brandScale[1], isDark ? 0.22 : 0.55),
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <IconFileDescription size={24} color={brandColor} />
                </Box>
                <Text fw={800} c={titleColor}>
                  {t("checkout.paymentProofFileReadyTitle")}
                </Text>
                <Text size="sm" c={textColor} ta="center">
                  {t("checkout.paymentProofFileReadyDescription")}
                </Text>
              </Stack>
            </Paper>
          ) : (
            <Paper
              radius={16}
              p="xl"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            >
              <Stack gap="xs" align="center">
                <Box
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: hexToRgba(brandScale[1], isDark ? 0.22 : 0.55),
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <IconPhoto size={24} color={brandColor} />
                </Box>
                <Text fw={800} c={titleColor}>
                  {t("checkout.paymentProofEmptyTitle")}
                </Text>
                <Text size="sm" c={textColor} ta="center">
                  {t("checkout.paymentProofEmptyDescription")}
                </Text>
              </Stack>
            </Paper>
          )}

          {paymentProofFile ? (
            <Paper
              radius={14}
              p="sm"
              style={{
                background: mutedBg,
                border: cardBorder,
              }}
            >
              <Group justify="space-between" align="center" wrap="wrap">
                <Stack gap={2}>
                  <Text fw={700} c={titleColor} lineClamp={1}>
                    {paymentProofFile.name}
                  </Text>
                  <Text size="xs" c={textColor}>
                    {(paymentProofFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Stack>
                <Button
                  variant="subtle"
                  color="red"
                  radius="xl"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => {
                    setPaymentProofFile(null);
                  }}
                >
                  {t("checkout.paymentProofRemove")}
                </Button>
              </Group>
            </Paper>
          ) : null}

          <Stack gap="sm">
            <FileButton onChange={handlePaymentProofSelect}>
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  color={brandColor}
                  radius="xl"
                  fullWidth
                  leftSection={<IconPhoto size={18} />}
                >
                  {paymentProofFile
                    ? t("checkout.paymentProofReplace")
                    : t("checkout.paymentProofUpload")}
                </Button>
              )}
            </FileButton>

            <Button
              radius="xl"
              color={brandColor}
              fullWidth
              onClick={handleConfirmPaymentProof}
              loading={createOrderMutation.isPending}
            >
              {t("checkout.paymentProofConfirm")}
            </Button>
          </Stack>
        </Stack>
      </Modal>

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
                        onCoordinatesChange={setDeliveryCoordinates}
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

                    <Box
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          paymentOptions.length > 1
                            ? "repeat(2, minmax(0, 1fr))"
                            : "minmax(0, 1fr)",
                        gap: 16,
                      }}
                    >
                      {paymentOptions.map((option) => {
                        const active = paymentType === option.value;
                        const shouldSpanFullRow =
                          paymentOptions.length > 2 &&
                          paymentOptions.length % 2 === 1 &&
                          option === paymentOptions[paymentOptions.length - 1];

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
                              gridColumn: shouldSpanFullRow
                                ? "1 / -1"
                                : undefined,
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
                                  {option.value === "card" ? (
                                    <IconCreditCard
                                      size={20}
                                      color={active ? "#ffffff" : brandColor}
                                    />
                                  ) : (
                                    <IconCash
                                      size={20}
                                      color={active ? "#ffffff" : brandColor}
                                    />
                                  )}
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
                    </Box>

                    {paymentType === "card" && cardPans.length > 0 ? (
                      <Paper
                        radius={18}
                        p="md"
                        style={{
                          background: mutedBg,
                          border: cardBorder,
                        }}
                      >
                        <Stack gap="sm">
                          <Group gap={6} align="center" wrap="nowrap">
                            <Text fw={700} c={titleColor}>
                              {t("checkout.paymentCardNumbers")}
                            </Text>
                            <Popover
                              width={280}
                              position="bottom-start"
                              withArrow
                              shadow="md"
                            >
                              <Popover.Target>
                                <ActionIcon
                                  variant="subtle"
                                  color="gray"
                                  radius="xl"
                                  size={24}
                                  aria-label={t(
                                    "checkout.paymentCardHelpLabel",
                                  )}
                                >
                                  <IconHelpCircle size={16} />
                                </ActionIcon>
                              </Popover.Target>
                              <Popover.Dropdown>
                                <Stack gap={6}>
                                  <Text size="sm" fw={700} c={titleColor}>
                                    {t("checkout.paymentCardHelpTitle")}
                                  </Text>
                                  <Text size="sm" c={textColor}>
                                    {t("checkout.paymentCardInstruction1")}
                                  </Text>
                                  <Text size="sm" c={textColor}>
                                    {t("checkout.paymentCardInstruction2")}
                                  </Text>
                                  <Text size="sm" c={textColor}>
                                    {t("checkout.paymentCardInstruction3")}
                                  </Text>
                                  <Text size="sm" c={textColor}>
                                    {t("checkout.paymentCardInstruction4")}
                                  </Text>
                                  <Text size="sm" c={textColor}>
                                    {t("checkout.paymentCardInstruction5")}
                                  </Text>
                                </Stack>
                              </Popover.Dropdown>
                            </Popover>
                          </Group>
                          <Text size="sm" c={textColor}>
                            {t("checkout.paymentCardHint")}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {t("checkout.paymentCardHelperText")}
                          </Text>
                          <Stack gap="xs">
                            {cardPans.map((cardPan) => (
                              <Paper
                                key={cardPan}
                                radius={14}
                                p="sm"
                                style={{
                                  background: surfaceBg,
                                  border: cardBorder,
                                }}
                              >
                                <Group
                                  justify="space-between"
                                  align="center"
                                  wrap="nowrap"
                                >
                                  <Text fw={700} c={titleColor}>
                                    {cardPan}
                                  </Text>
                                  <Group gap="xs" wrap="nowrap">
                                    <ActionIcon
                                      variant="light"
                                      color={brandColor}
                                      radius="xl"
                                      size={36}
                                      onClick={() =>
                                        void handleCopyCardPan(cardPan)
                                      }
                                      aria-label={t("checkout.paymentCardCopy")}
                                    >
                                      <IconCopy size={16} />
                                    </ActionIcon>
                                    <IconCreditCard
                                      size={18}
                                      color={brandColor}
                                    />
                                  </Group>
                                </Group>
                              </Paper>
                            ))}
                          </Stack>
                        </Stack>
                      </Paper>
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
                      {t("checkout.contactTitle")}
                    </Title>
                    {requiresPaymentPhone ? (
                      <TextInput
                        label={t("checkout.phoneLabel")}
                        placeholder={t("checkout.phonePlaceholder")}
                        radius="md"
                        value={paymentPhoneNumber}
                        onChange={(event) =>
                          setPaymentPhoneNumber(event.currentTarget.value)
                        }
                        description={t(
                          paymentType === "payme"
                            ? "checkout.paymentPaymeHint"
                            : "checkout.paymentClickHint",
                        )}
                      />
                    ) : null}
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

                    <Stack gap={8}>
                      <Group justify="space-between" align="center">
                        <Text fw={600} c={textColor}>
                          {t("checkout.subtotal")}
                        </Text>
                        <Text fw={700} c={titleColor}>
                          {formatPrice(summarySubtotal)}
                        </Text>
                      </Group>

                      <Group justify="space-between" align="center">
                        <Text fw={600} c={textColor}>
                          {t("checkout.shippingCost")}
                        </Text>
                        <Text fw={700} c={titleColor}>
                          {formatPrice(summaryShippingCost)}
                        </Text>
                      </Group>

                      {typeof deliveryEstimatedTime === "number" ? (
                        <Group justify="space-between" align="center">
                          <Text fw={600} c={textColor}>
                            {t("checkout.deliveryEstimatedTime")}
                          </Text>
                          <Text fw={700} c={titleColor}>
                            {formatDeliveryEstimatedTime(deliveryEstimatedTime)}
                          </Text>
                        </Group>
                      ) : null}
                    </Stack>

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
                        {formatPrice(summaryFinalTotal)}
                      </Text>
                    </Group>

                    {isCheckoutQuoteLoading ? (
                      <Text size="sm" c={textColor}>
                        {t("checkout.summaryLoading")}
                      </Text>
                    ) : null}

                    {isCheckoutQuoteError ? (
                      <Text size="sm" c="red.6">
                        {checkoutQuoteError instanceof Error
                          ? checkoutQuoteError.message
                          : t("checkout.summaryLoadError")}
                      </Text>
                    ) : null}

                    <Button
                      size="md"
                      radius="xl"
                      color={brandColor}
                      onClick={handleOrderButtonClick}
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
    </>
  );
}
