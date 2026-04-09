import {
  Drawer,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
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
  userName?: string;
  userSubtitle?: string;
}

export function SettingsDrawer({
  opened,
  onClose,
  locale,
  onLocaleChange,
  isDark,
  onToggleDarkMode,
  titleColor,
  textColor,
}: SettingsDrawerProps) {
  const { t } = useTranslation();
  const drawerBg = isDark ? "#181b22" : "#f6f7fb";
  const cardBg = isDark ? "#1b1f27" : "#ffffff";
  const rowBg = isDark ? "#232831" : "#f4f6fa";
  const borderColor = isDark
    ? "1px solid rgba(255,255,255,0.06)"
    : "1px solid rgba(15,23,42,0.06)";
  const rowBorder = isDark
    ? "1px solid rgba(255,255,255,0.04)"
    : "1px solid rgba(15,23,42,0.05)";

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={t("settings.title")}
      padding="md"
      size="100%"
      styles={{
        content: {
          background: drawerBg,
        },
        header: {
          background: "transparent",
          color: titleColor,
          paddingBottom: 6,
        },
        title: {
          fontWeight: 900,
          fontSize: "1rem",
          letterSpacing: "-0.02em",
        },
        body: {
          background: "transparent",
        },
      }}
    >
      <Paper
        radius={18}
        p={12}
        style={{
          background: cardBg,
          border: borderColor,
          maxWidth: 520,
        }}
      >
        <Stack gap={10}>
          <Group
            justify="space-between"
            align="center"
            wrap="nowrap"
            px={12}
            py={10}
            style={{
              background: rowBg,
              border: rowBorder,
              borderRadius: 16,
            }}
          >
            <Stack gap={4}>
              <Text fw={800} fz="0.9rem" c={titleColor} lh={1.1}>
                {t("settings.language")}
              </Text>
              <Text mt={"3px"} fz="0.74rem" c={textColor} lh={1.1}>
                UZ / RU
              </Text>
            </Stack>

            <SegmentedControl
              radius="xl"
              size="xs"
              value={locale}
              onChange={(value) => onLocaleChange(value as Locale)}
              data={[
                { label: "UZ", value: "uz" },
                { label: "RU", value: "ru" },
              ]}
              styles={{
                root: {
                  background: isDark ? "#2b313d" : "#e9edf3",
                  padding: 4,
                },
                control: {
                  minWidth: 44,
                },
                indicator: {
                  background: isDark ? "#343b48" : "#ffffff",
                  boxShadow: isDark
                    ? "0 3px 10px rgba(0,0,0,0.22)"
                    : "0 2px 8px rgba(15,23,42,0.08)",
                },
                label: {
                  minHeight: 30,
                  paddingInline: 12,
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: isDark ? "#d9dee7" : textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  letterSpacing: "0.01em",
                  textTransform: "lowercase",
                },
              }}
            />
          </Group>

          <Group
            justify="space-between"
            align="center"
            wrap="nowrap"
            px={12}
            py={10}
            style={{
              background: rowBg,
              border: rowBorder,
              borderRadius: 16,
            }}
          >
            <Stack gap={4}>
              <Text fw={800} fz="0.9rem" c={titleColor} lh={1.1}>
                {t("settings.darkMode")}
              </Text>
              <Text mt={"3px"} fz="0.74rem" c={textColor} lh={1.1}>
                {t("settings.switchAppearance")}
              </Text>
            </Stack>

            <Switch
              size="sm"
              color="dark"
              checked={isDark}
              onChange={(event) =>
                onToggleDarkMode(event.currentTarget.checked)
              }
              aria-label={t("settings.darkMode")}
              styles={{
                track: {
                  cursor: "pointer",
                  background: isDark ? "#35b558" : undefined,
                  borderColor: "transparent",
                },
                thumb: {
                  borderWidth: 0,
                },
              }}
            />
          </Group>
        </Stack>
      </Paper>
    </Drawer>
  );
}
