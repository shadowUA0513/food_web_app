import {
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBurger,
  IconDeviceMobile,
  IconShoppingBag,
} from '@tabler/icons-react'
import { telegramService } from '../../../shared/services/telegram.service'
import { TELEGRAM_MOBILE_WIDTH } from '../../../shared/config/telegram'

export function HomeScreen() {
  const user = telegramService.getUser()
  const firstName = user?.first_name ?? 'friend'

  return (
    <AppShell bg="transparent" padding={0}>
      <AppShell.Main>
        <Box
          mih="100dvh"
          px="md"
          py="md"
          style={{
            background:
              'radial-gradient(circle at top, rgba(255, 208, 141, 0.45), transparent 32%), linear-gradient(180deg, #fff8ee 0%, #f6efe5 100%)',
          }}
        >
          <Stack maw={TELEGRAM_MOBILE_WIDTH} mx="auto" gap="md">
            <Paper
              radius={28}
              p="xl"
              shadow="xl"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,244,226,0.96))',
                border: '1px solid rgba(145, 98, 56, 0.14)',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Badge size="lg" radius="xl" color="orange" variant="light">
                    Telegram Food Web App
                  </Badge>
                  <ThemeIcon size={44} radius="xl" color="orange">
                    <IconDeviceMobile size={22} />
                  </ThemeIcon>
                </Group>

                <Title order={1} fz="clamp(2rem, 7vw, 2.8rem)" lh={1.02}>
                  Order food in a clean mobile flow.
                </Title>

                <Text c="dimmed" size="md">
                  The app now uses Mantine components and stays constrained to a
                  Telegram-style phone width instead of opening like a desktop
                  page.
                </Text>

                <Button size="md" radius="xl" variant="filled" color="orange">
                  Continue setup
                </Button>
              </Stack>
            </Paper>

            <Card radius="xl" p="lg" shadow="sm" withBorder bg="rgba(255,252,247,0.9)">
              <Stack gap={6}>
                <Text size="xs" tt="uppercase" fw={700} c="orange.7">
                  Session
                </Text>
                <Text fw={700} fz="lg">
                  Hello, {firstName}
                </Text>
                <Text c="dimmed">
                  Telegram service is connected and ready for user data, theme
                  colors, viewport behavior, and bot actions.
                </Text>
              </Stack>
            </Card>

            <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
              <Card radius="xl" p="lg" shadow="sm" withBorder bg="rgba(255,252,247,0.9)">
                <Stack gap="sm">
                  <ThemeIcon radius="xl" size={42} color="orange" variant="light">
                    <IconBurger size={20} />
                  </ThemeIcon>
                  <Text size="xs" tt="uppercase" fw={700} c="orange.7">
                    Structure
                  </Text>
                  <Text fw={700}>FSD base</Text>
                  <Text c="dimmed" size="sm">
                    `app`, `pages`, `widgets`, and `shared` are ready to grow.
                  </Text>
                </Stack>
              </Card>

              <Card radius="xl" p="lg" shadow="sm" withBorder bg="rgba(255,252,247,0.9)">
                <Stack gap="sm">
                  <ThemeIcon radius="xl" size={42} color="orange" variant="light">
                    <IconShoppingBag size={20} />
                  </ThemeIcon>
                  <Text size="xs" tt="uppercase" fw={700} c="orange.7">
                    UI
                  </Text>
                  <Text fw={700}>Mantine ready</Text>
                  <Text c="dimmed" size="sm">
                    Next we can build catalog, cart, and checkout with Mantine.
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>
          </Stack>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
