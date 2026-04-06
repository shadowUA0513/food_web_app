import {
  ActionIcon,
  Box,
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
  IconUserCircle,
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
  userName?: string;
  userSubtitle?: string;
}

const languageOptions: Array<{
  value: Locale;
  label: string;
  caption: string;
  accent: string;
}> = [
  {
    value: "uz",
    label: "O'zbekcha",
    caption: "Latin script",
    accent: "#f78f26",
  },
  {
    value: "ru",
    label: "Russian",
    caption: "Cyrillic script",
    accent: "#4f8cff",
  },
];

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
  userName,
  userSubtitle,
}: SettingsDrawerProps) {
  const { t } = useTranslation();

  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.07)"
    : "1px solid rgba(15,23,42,0.08)";
  const subtleBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(15,23,42,0.07)";
  const panelBg = isDark
    ? "linear-gradient(180deg, rgba(29,33,42,0.98) 0%, rgba(21,24,31,0.98) 100%)"
    : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,248,252,0.98) 100%)";
  const heroBg = isDark
    ? "radial-gradient(circle at top left, rgba(247,143,38,0.22), transparent 44%), linear-gradient(180deg, #1f232d 0%, #171a21 100%)"
    : "radial-gradient(circle at top left, rgba(247,143,38,0.16), transparent 42%), linear-gradient(180deg, #fffaf4 0%, #ffffff 100%)";

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={t("settings.title")}
      padding="lg"
      styles={{
        content: { background: panelBg },
        header: {
          background: "transparent",
          color: titleColor,
          paddingBottom: 8,
        },
        title: {
          fontWeight: 900,
          fontSize: "1.05rem",
          letterSpacing: "-0.02em",
        },
        body: {
          background: "transparent",
        },
      }}
    >
      <Stack gap="lg">
        {userName ? (
          <Paper
            radius={24}
            p="lg"
            style={{
              background: surfaceBg,
              border: cardBorder,
              boxShadow: isDark
                ? "0 14px 32px rgba(0,0,0,0.22)"
                : "0 16px 32px rgba(15,23,42,0.06)",
            }}
          >
            <Group gap="sm" wrap="nowrap">
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark
                    ? "rgba(247,143,38,0.12)"
                    : "rgba(247,143,38,0.08)",
                  color: "#f78f26",
                }}
              >
                <IconUserCircle size={24} />
              </Box>

              <Stack gap={1}>
                <Text fw={900} c={titleColor}>
                  {userName}
                </Text>
                {userSubtitle ? (
                  <Text size="sm" c={textColor}>
                    {userSubtitle}
                  </Text>
                ) : null}
              </Stack>
            </Group>
          </Paper>
        ) : null}

        <Paper
          radius={28}
          p="lg"
          style={{
            position: "relative",
            overflow: "hidden",
            background: heroBg,
            border: cardBorder,
            boxShadow: isDark
              ? "0 18px 38px rgba(0,0,0,0.32)"
              : "0 20px 40px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: -44,
              right: -34,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(247,143,38,0.09)",
            }}
          />

          <Stack gap="lg" style={{ position: "relative" }}>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <ActionIcon
                size={48}
                radius="xl"
                variant="filled"
                color="orange"
                style={{
                  boxShadow: "0 12px 24px rgba(247,143,38,0.28)",
                }}
              >
                <IconLanguage size={22} />
              </ActionIcon>

              <Stack gap={2}>
                <Text fw={900} fz="1.15rem" c={titleColor} lh={1.1}>
                  {t("settings.language")}
                </Text>
                <Text size="sm" c={textColor} maw={240}>
                  {t("settings.chooseLanguage")}
                </Text>
              </Stack>
            </Group>

            <Stack gap="sm">
              {languageOptions.map((option) => {
                const active = locale === option.value;

                return (
                  <Paper
                    key={option.value}
                    component="button"
                    type="button"
                    radius={22}
                    p="md"
                    onClick={() => onLocaleChange(option.value)}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      textAlign: "left",
                      background: active
                        ? isDark
                          ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
                          : "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,247,240,1) 100%)"
                        : mutedBg,
                      border: active ? `1px solid ${option.accent}` : subtleBorder,
                      boxShadow: active
                        ? isDark
                          ? `0 14px 26px ${option.accent}22`
                          : `0 16px 30px ${option.accent}22`
                        : "none",
                      transition: "all 160ms ease",
                    }}
                  >
                    <Group justify="space-between" align="center" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Box
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: active ? `${option.accent}18` : "transparent",
                            border: active
                              ? `1px solid ${option.accent}55`
                              : subtleBorder,
                            color: active ? option.accent : textColor,
                            fontWeight: 900,
                            fontSize: "0.82rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {option.value.toUpperCase()}
                        </Box>

                        <Stack gap={1}>
                          <Text fw={800} fz="1rem" c={titleColor}>
                            {option.label}
                          </Text>
                          <Text size="xs" c={textColor}>
                            {option.caption}
                          </Text>
                        </Stack>
                      </Group>

                      <Box
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: active ? option.accent : "transparent",
                          border: active
                            ? "none"
                            : isDark
                              ? "1px solid rgba(255,255,255,0.12)"
                              : "1px solid rgba(15,23,42,0.12)",
                          color: active ? "#ffffff" : "transparent",
                        }}
                      >
                        <IconCheck size={16} />
                      </Box>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </Stack>
        </Paper>

        <Paper
          radius={24}
          p="lg"
          style={{
            background: surfaceBg,
            border: cardBorder,
            boxShadow: isDark
              ? "0 14px 32px rgba(0,0,0,0.22)"
              : "0 16px 32px rgba(15,23,42,0.06)",
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Box
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark
                    ? "rgba(255,214,10,0.12)"
                    : "rgba(15,23,42,0.05)",
                  color: isDark ? "#ffd54a" : "#151515",
                }}
              >
                <IconMoonStars size={21} />
              </Box>

              <Stack gap={1}>
                <Text fw={800} c={titleColor}>
                  {t("settings.darkMode")}
                </Text>
                <Text size="sm" c={textColor} maw={220}>
                  {t("settings.switchAppearance")}
                </Text>
              </Stack>
            </Group>

            <Switch
              checked={isDark}
              onChange={(event) => onToggleDarkMode(event.currentTarget.checked)}
              color="orange"
              size="lg"
              thumbIcon={
                isDark ? (
                  <IconMoonStars size={12} stroke={2.5} />
                ) : (
                  <IconCheck size={12} stroke={2.5} />
                )
              }
            />
          </Group>
        </Paper>
      </Stack>
    </Drawer>
  );
}
