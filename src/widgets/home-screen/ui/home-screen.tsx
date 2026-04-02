import {
  AppShell,
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
import { IconChevronRight } from "@tabler/icons-react";
import { useCompanyMenu } from "../../../service/menu";
import { useCompanySettings } from "../../../service/settings";
import { TELEGRAM_MOBILE_WIDTH } from "../../../shared/config/telegram";

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

export function HomeScreen() {
  const companyId = getCompanyId();
  const { data: settings } = useCompanySettings(companyId);
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useCompanyMenu(companyId);
  const visibleCategories = categories.filter(
    ({ products }) => products.length > 0,
  );

  return (
    <AppShell bg="#f3f4f6" padding={0}>
      <AppShell.Main>
        <Box mih="100dvh" bg="#f3f4f6" px={12} py={14}>
          <Stack maw={TELEGRAM_MOBILE_WIDTH} mx="auto" gap="lg">
            <Paper
              radius={28}
              p="lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,248,240,0.96) 100%)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text
                    size="xs"
                    fw={800}
                    tt="uppercase"
                    c="orange.6"
                    lts="0.08em"
                  >
                    Food delivery
                  </Text>
                  <Title order={1} fz="1.55rem" fw={900} lh={1.05} c="#121212">
                    {settings?.name ?? "Food Menu"}
                  </Title>
                  <Text size="sm" c="#666" maw={260} lh={1.45}>
                    Hot meals, quick combos, and fast ordering in one clean
                    mobile menu.
                  </Text>
                </Stack>

                {settings?.logo_url ? (
                  <Image
                    src={settings.logo_url}
                    alt={settings.name}
                    w={58}
                    h={58}
                    radius="xl"
                    fit="cover"
                    style={{ flexShrink: 0 }}
                  />
                ) : null}
              </Group>
            </Paper>

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
                  background: "#fff1f0",
                  border: "1px solid #ffd7d2",
                }}
              >
                <Text fw={800} c="red.7">
                  Could not load menu
                </Text>
                <Text size="sm" c="red.6" mt={4}>
                  {error instanceof Error ? error.message : "Unknown error"}
                </Text>
              </Paper>
            ) : null}

            {visibleCategories.map(({ category, products }) => (
              <Stack key={category.id} gap="sm">
                <Group justify="space-between" align="center" px={2}>
                  <Title order={2} fz="1.15rem" fw={800} c="#151515">
                    {category.name_ru || category.name_uz}
                  </Title>
                  <Group gap={4} c="#8a8f98">
                    <Text size="sm" fw={700}>
                      {products.length}
                    </Text>
                    <IconChevronRight size={16} stroke={2} />
                  </Group>
                </Group>

                <SimpleGrid cols={2} spacing={12} verticalSpacing={12}>
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      radius={18}
                      p={0}
                      style={{
                        overflow: "hidden",
                        background: "#ffffff",
                        boxShadow: "0 2px 14px rgba(17, 24, 39, 0.05)",
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
                          background: "#ffffff",
                        }}
                      >
                        <Image
                          src={product.image_url}
                          alt={product.name_ru || product.name_uz}
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
                          c="#121212"
                          lineClamp={2}
                        >
                          {product.name_ru || product.name_uz}
                        </Text>

                        <Text
                          size="xs"
                          c="#5f6670"
                          lh={1.35}
                          lineClamp={3}
                          mih={48}
                        >
                          {product.description ||
                            "Fresh ingredients and quick delivery."}
                        </Text>

                        <Group
                          justify="space-between"
                          align="end"
                          gap="xs"
                          mt={2}
                        >
                          <Text fw={900} fz="1.1rem" c="#111111">
                            {formatPrice(product.price)}
                          </Text>
                          {!product.is_available ? (
                            <Text
                              size="10px"
                              fw={800}
                              c="#df4b41"
                              tt="uppercase"
                            >
                              Closed
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
                  background: "#ffffff",
                  border: "1px solid rgba(235, 235, 235, 0.95)",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
                }}
              >
                <Text fw={800} c="#1a1a1a">
                  No products found
                </Text>
                <Text size="sm" c="#6b7280" mt={4}>
                  The menu loaded, but there are no products to show right now.
                </Text>
              </Paper>
            ) : null}
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
