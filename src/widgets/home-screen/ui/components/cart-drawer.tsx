import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { ProductImage } from "../../../../shared/lib/product-image";
import type { CartItem } from "../../../../shared/store/cart-store";
interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
  cartList: CartItem[];
  cartTotalPrice: number;
  isDark: boolean;
  surfaceBg: string;
  titleColor: string;
  textColor: string;
  mutedBg: string;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  getLocalizedValue: (nameUz: string, nameRu: string) => string;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
}

export function CartDrawer({
  opened,
  onClose,
  cartList,
  cartTotalPrice,
  isDark,
  surfaceBg,
  titleColor,
  textColor,
  mutedBg,
  incrementItem,
  decrementItem,
  clearCart,
  getLocalizedValue,
  formatPrice,
  onCheckout,
}: CartDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={t("cart.title")}
      padding="lg"
      styles={{
        content: { background: surfaceBg },
        header: { background: surfaceBg, color: titleColor },
        title: { fontWeight: 800 },
        body: { background: surfaceBg },
      }}
    >
      <Stack gap="md">
        {cartList.length === 0 ? (
          <Paper
            radius={16}
            p="md"
            style={{
              background: mutedBg,
              border: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(17,24,39,0.08)",
            }}
          >
            <Text fw={700} c={titleColor}>
              {t("cart.emptyTitle")}
            </Text>
            <Text size="sm" c={textColor} mt={4}>
              {t("cart.emptyDescription")}
            </Text>
          </Paper>
        ) : (
          <>
            <Stack gap="sm">
              {cartList.map(({ product, count }) => (
                <Paper
                  key={product.id}
                  radius={16}
                  p="sm"
                  style={{
                    background: mutedBg,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(17,24,39,0.08)",
                  }}
                >
                  <Group wrap="nowrap" align="center">
                    <ProductImage
                      src={product.image_url}
                      alt={getLocalizedValue(product.name_uz, product.name_ru)}
                      w={56}
                      h={56}
                      radius={12}
                      fit="cover"
                    />
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text fw={700} c={titleColor} lineClamp={1}>
                        {getLocalizedValue(product.name_uz, product.name_ru)}
                      </Text>
                      <Group gap={8} wrap="nowrap" mt={2}>
                        <ActionIcon
                          radius="xl"
                          variant="light"
                          color="orange"
                          size={26}
                          onClick={() => decrementItem(product.id)}
                        >
                          <IconMinus size={14} />
                        </ActionIcon>
                        <Text fw={800} c={titleColor} w={18} ta="center">
                          {count}
                        </Text>
                        <ActionIcon
                          radius="xl"
                          variant="filled"
                          color="orange"
                          size={26}
                          onClick={() => incrementItem(product.id)}
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                    <Text fw={800} c={titleColor}>
                      {formatPrice(product.price * count)}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Paper
              radius={16}
              p="md"
              style={{
                background: mutedBg,
                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(17,24,39,0.08)",
              }}
            >
              <Group justify="space-between" align="center">
                <Text fw={800} c={titleColor}>
                  {t("cart.total")}
                </Text>
                <Text fw={900} c={titleColor}>
                  {formatPrice(cartTotalPrice)}
                </Text>
              </Group>
            </Paper>
            <Group grow>
              <Button
                size="md"
                radius="xl"
                variant="light"
                color="red"
                onClick={clearCart}
                styles={{
                  root: {
                    height: 50,
                    fontWeight: 800,
                  },
                }}
              >
                {t("cart.clearAll")}
              </Button>
              <Button
                size="md"
                radius="xl"
                color="orange"
                onClick={onCheckout}
                styles={{
                  root: {
                    height: 50,
                    fontWeight: 800,
                  },
                }}
              >
                {t("cart.accept")}
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
