import {
  ActionIcon,
  Drawer,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconLanguage,
  IconMoonStars,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../home-screen-types";

interface SettingsDrawerProps {
  opened: boolean;
  onClose: () => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  isDark: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  surfaceBg: string;
  titleColor: string;
  textColor: string;
  mutedBg: string;
}

export function SettingsDrawer({
  opened,
  onClose,
  locale,
  onLocaleChange,
  isDark,
  onToggleDarkMode,
  surfaceBg,
  titleColor,
  textColor,
  mutedBg,
}: SettingsDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={t("settings.title")}
      padding="lg"
      styles={{
        content: { background: surfaceBg },
        header: { background: surfaceBg, color: titleColor },
        title: { fontWeight: 800 },
        body: { background: surfaceBg },
      }}
    >
      <Stack gap="lg">
        <Paper
          radius={20}
          p="md"
          style={{
            background: mutedBg,
            border: isDark
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(17,24,39,0.06)",
          }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <ActionIcon size={38} radius="xl" variant="light" color="orange">
                  <IconLanguage size={18} />
                </ActionIcon>
                <Stack gap={0}>
                  <Text fw={800} c={titleColor}>
                    {t("settings.language")}
                  </Text>
                  <Text size="xs" c={textColor}>
                    {t("settings.chooseLanguage")}
                  </Text>
                </Stack>
              </Group>
            </Group>

            <Group grow>
              <Paper
                component="button"
                type="button"
                radius="xl"
                p="sm"
                onClick={() => onLocaleChange("uz")}
                style={{
                  cursor: "pointer",
                  background:
                    locale === "uz" ? (isDark ? "#252a33" : "#ffffff") : "transparent",
                  border:
                    locale === "uz"
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)"}`
                      : "1px solid transparent",
                  boxShadow:
                    locale === "uz" && !isDark
                      ? "0 8px 20px rgba(15, 23, 42, 0.06)"
                      : "none",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={0}>
                    <Text fw={800} c={titleColor}>
                      O'zbekcha
                    </Text>
                    <Text size="xs" c={textColor}>
                      UZ
                    </Text>
                  </Stack>
                  {locale === "uz" ? <IconCheck size={18} color="#f78f26" /> : null}
                </Group>
              </Paper>

              <Paper
                component="button"
                type="button"
                radius="xl"
                p="sm"
                onClick={() => onLocaleChange("ru")}
                style={{
                  cursor: "pointer",
                  background:
                    locale === "ru" ? (isDark ? "#252a33" : "#ffffff") : "transparent",
                  border:
                    locale === "ru"
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.08)"}`
                      : "1px solid transparent",
                  boxShadow:
                    locale === "ru" && !isDark
                      ? "0 8px 20px rgba(15, 23, 42, 0.06)"
                      : "none",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={0}>
                    <Text fw={800} c={titleColor}>
                      Русский
                    </Text>
                    <Text size="xs" c={textColor}>
                      RU
                    </Text>
                  </Stack>
                  {locale === "ru" ? <IconCheck size={18} color="#f78f26" /> : null}
                </Group>
              </Paper>
            </Group>
          </Stack>
        </Paper>

        <Paper
          radius={20}
          p="md"
          style={{
            background: mutedBg,
            border: isDark
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(17,24,39,0.06)",
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ActionIcon
                size={38}
                radius="xl"
                variant="light"
                color={isDark ? "yellow" : "dark"}
              >
                <IconMoonStars size={18} />
              </ActionIcon>
              <Stack gap={0}>
                <Text fw={800} c={titleColor}>
                  {t("settings.darkMode")}
                </Text>
                <Text size="xs" c={textColor}>
                  {t("settings.switchAppearance")}
                </Text>
              </Stack>
            </Group>

            <Switch
              checked={isDark}
              onChange={(event) => onToggleDarkMode(event.currentTarget.checked)}
              color="orange"
              size="md"
            />
          </Group>
        </Paper>
      </Stack>
    </Drawer>
  );
}
