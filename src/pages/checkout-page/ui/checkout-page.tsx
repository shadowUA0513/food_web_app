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
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateCompanyOrder } from "../../../service/order";
import { useCompanyPartners } from "../../../service/partners";
import { useTelegramUser } from "../../../service/telegram-user";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";
import { showAppNotification } from "../../../shared/lib/notifications";
import { useCartStore } from "../../../shared/store/cart-store";
import { SettingsDrawer } from "../../../widgets/home-screen/ui/components/settings-drawer";
import {
  formatPrice,
  getCompanyId,
  getPartnerId,
  getTelegramId,
} from "../../../widgets/home-screen/ui/home-utils";
import type { Locale } from "../../../widgets/home-screen/ui/home-screen-types";
import type { Partner } from "../../../types/partner";

type OrderType = "partners" | "myself";

export function CheckoutPage() {
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const [partnersOpened, { open: openPartners, close: closePartners }] = useDisclosure(false);
  const { t, i18n } = useTranslation();
  const { setColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const computedColorScheme = useComputedColorScheme("light");
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const companyId = getCompanyId();
  const initialPartnerId = getPartnerId();
  const telegramId = getTelegramId();
  const [orderType, setOrderType] = useState<OrderType>(
    initialPartnerId ? "partners" : "myself",
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState(initialPartnerId ?? "");
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
    () => cartList.reduce((sum, item) => sum + item.product.price * item.count, 0),
    [cartList],
  );
  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === selectedPartnerId) ?? null,
    [partners, selectedPartnerId],
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

  function getPartnerLabel(partner: Partner) {
    return (
      partner.name ??
      partner.full_name ??
      partner.title ??
      partner.phone ??
      partner.phone_number ??
      partner.id
    );
  }

  async function handleSubmitOrder() {
    if (!customerName.trim()) {
      showAppNotification({
        title: t("checkout.validationName"),
        color: "red",
      });
      return;
    }

    if (!phone.trim()) {
      showAppNotification({
        title: t("checkout.validationPhone"),
        color: "red",
      });
      return;
    }

    if (!address.trim()) {
      showAppNotification({
        title: t("checkout.validationAddress"),
        color: "red",
      });
      return;
    }

    const partnerId = orderType === "partners" ? selectedPartnerId : initialPartnerId ?? "";

    if (!partnerId) {
      showAppNotification({
        title: t("checkout.missingPartner"),
        color: "red",
      });
      return;
    }

    if (!telegramUser?.ID) {
      showAppNotification({
        title: t("checkout.missingUser"),
        color: "red",
      });
      return;
    }

    const noteParts = [
      `${t("checkout.nameLabel")}: ${customerName.trim()}`,
      `${t("checkout.phoneLabel")}: ${phone.trim()}`,
      comment.trim() ? `${t("checkout.commentLabel")}: ${comment.trim()}` : "",
    ].filter(Boolean);

    const orderPayload = {
      company_id: companyId,
      partner_id: partnerId,
      delivery_address: address.trim(),
      user_id: telegramUser.ID,
      comment: noteParts.join(" | "),
      items: cartList.map(({ product, count }) => ({
        product_id: product.id,
        quantity: count,
        price: product.price,
      })),
    };

    try {
      await createOrderMutation.mutateAsync(orderPayload);

      clearCart();
      showAppNotification({
        title: t("checkout.submitSuccessTitle"),
        message: t("checkout.submitSuccessMessage"),
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
        onToggleDarkMode={(enabled) => setColorScheme(enabled ? "dark" : "light")}
        surfaceBg={surfaceBg}
        titleColor={titleColor}
        textColor={textColor}
        mutedBg={mutedBg}
        userName={telegramUser?.FullName}
        userSubtitle={
          telegramUser?.Username ? `@${telegramUser.Username}` : undefined
        }
      />

      <Drawer
        opened={partnersOpened}
        onClose={closePartners}
        position="right"
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

          {isPartnersLoading ? (
            <Group justify="center" py="md">
              <Loader color="orange" />
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

          {!isPartnersLoading && !isPartnersError
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
                      border: active ? "1px solid #f78f26" : cardBorder,
                    }}
                  >
                    <Stack gap={4}>
                      <Text fw={800} c={titleColor}>
                        {getPartnerLabel(partner)}
                      </Text>
                      <Text size="xs" c={textColor}>
                        {partner.phone ?? partner.phone_number ?? partner.id}
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
                      {t("checkout.orderTypeTitle")}
                    </Title>

                    <Group grow>
                      <Paper
                        component="button"
                        type="button"
                        radius={18}
                        p="md"
                        onClick={() => {
                          setOrderType("partners");
                          openPartners();
                        }}
                        style={{
                          cursor: "pointer",
                          textAlign: "left",
                          background: orderType === "partners" ? mutedBg : surfaceBg,
                          border:
                            orderType === "partners"
                              ? "1px solid #f78f26"
                              : cardBorder,
                        }}
                      >
                        <Stack gap={4}>
                          <Text fw={800} c={titleColor}>
                            {t("checkout.orderTypePartners")}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {t("checkout.orderTypePartnersHint")}
                          </Text>
                        </Stack>
                      </Paper>

                      <Paper
                        component="button"
                        type="button"
                        radius={18}
                        p="md"
                        onClick={() => setOrderType("myself")}
                        style={{
                          cursor: "pointer",
                          textAlign: "left",
                          background: orderType === "myself" ? mutedBg : surfaceBg,
                          border:
                            orderType === "myself"
                              ? "1px solid #f78f26"
                              : cardBorder,
                        }}
                      >
                        <Stack gap={4}>
                          <Text fw={800} c={titleColor}>
                            {t("checkout.orderTypeMyself")}
                          </Text>
                          <Text size="sm" c={textColor}>
                            {t("checkout.orderTypeMyselfHint")}
                          </Text>
                        </Stack>
                      </Paper>
                    </Group>

                    {orderType === "partners" ? (
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
                              color="orange"
                              radius="xl"
                              onClick={openPartners}
                            >
                              {t("checkout.choosePartner")}
                            </Button>
                          </Group>
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
                    <TextInput
                      label={t("checkout.nameLabel")}
                      placeholder={t("checkout.namePlaceholder")}
                      leftSection={<IconUser size={16} />}
                      radius="md"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.currentTarget.value)}
                    />
                    <TextInput
                      label={t("checkout.phoneLabel")}
                      placeholder={t("checkout.phonePlaceholder")}
                      leftSection={<IconPhone size={16} />}
                      radius="md"
                      value={phone}
                      onChange={(event) => setPhone(event.currentTarget.value)}
                    />
                    <TextInput
                      label={t("checkout.addressLabel")}
                      placeholder={t("checkout.addressPlaceholder")}
                      leftSection={<IconMapPin size={16} />}
                      radius="md"
                      value={address}
                      onChange={(event) => setAddress(event.currentTarget.value)}
                    />
                    <Textarea
                      label={t("checkout.commentLabel")}
                      placeholder={t("checkout.commentPlaceholder")}
                      minRows={3}
                      radius="md"
                      value={comment}
                      onChange={(event) => setComment(event.currentTarget.value)}
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
                      onClick={handleSubmitOrder}
                      loading={createOrderMutation.isPending}
                      disabled={createOrderMutation.isPending}
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
