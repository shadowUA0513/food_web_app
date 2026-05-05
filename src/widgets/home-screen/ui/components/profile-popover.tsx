import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Popover,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronRight,
  IconHeadset,
  IconHistory,
  IconLanguage,
  IconMoonStars,
  IconPhone,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { hexToRgba } from "../../../../app/theme/theme";
import type { Locale } from "../home-screen-types";

interface ProfilePopoverProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  isDark: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  brandColor: string;
  titleColor: string;
  textColor: string;
  userName?: string;
  userSubtitle?: string;
  phoneNumbers?: string[];
  onOpenOrderHistory?: () => void;
}

export function ProfilePopover({
  locale,
  onLocaleChange,
  isDark,
  onToggleDarkMode,
  brandColor,
  titleColor,
  textColor,
  userName,
  userSubtitle,
  phoneNumbers,
  onOpenOrderHistory,
}: ProfilePopoverProps) {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const cardBg = isDark ? "#1c2028" : "#ffffff";
  const rowBg = isDark ? "#252b35" : "#f7f8fb";
  const borderColor = isDark
    ? "1px solid rgba(255,255,255,0.07)"
    : "1px solid rgba(15,23,42,0.08)";
  const dividerColor = isDark ? "rgba(255,255,255,0.08)" : "#e8ebf0";
  const sectionColor = isDark ? "#9ca6b4" : "#8b95a4";
  const actionIconColor = isDark ? "#d4d9e1" : "#131313";

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      offset={14}
      withArrow
      arrowSize={12}
      arrowOffset={20}
      shadow="md"
      width={244}
      zIndex={260}
    >
      <Popover.Target>
        <ActionIcon
          size={36}
          radius={12}
          variant="filled"
          onClick={() => setOpened((current) => !current)}
          aria-label={t("settings.title")}
          style={{
            background: brandColor,
            color: "#141414",
            boxShadow: isDark
              ? `0 8px 16px ${hexToRgba(brandColor, 0.2)}`
              : `0 8px 16px ${hexToRgba(brandColor, 0.16)}`,
            flexShrink: 0,
          }}
        >
          <IconUserCircle size={20} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        p={12}
        style={{
          background: cardBg,
          border: borderColor,
          borderRadius: 18,
          boxShadow: isDark
            ? "0 18px 36px rgba(0,0,0,0.28)"
            : "0 14px 28px rgba(15,23,42,0.12)",
        }}
      >
        <Stack gap={10}>
          <Stack gap={8}>
            <Text fw={800} fz="0.76rem" c={sectionColor}>
              {t("settings.userInfo")}
            </Text>

            {userName ? (
              <InfoRow
                icon={<IconUser size={20} stroke={1.9} />}
                text={userName}
                titleColor={titleColor}
                textColor={textColor}
              />
            ) : null}

            {userSubtitle ? (
              <InfoRow
                icon={<IconPhone size={20} stroke={1.9} />}
                text={userSubtitle}
                titleColor={titleColor}
                textColor={textColor}
              />
            ) : null}
          </Stack>

          <Divider color={dividerColor} />

          <Stack gap={8}>
            <Text fw={800} fz="0.76rem" c={sectionColor}>
              {t("settings.ordersSection")}
            </Text>

            <MenuAction
              icon={<IconHistory size={20} stroke={1.9} />}
              label={t("settings.orderHistory")}
              titleColor={titleColor}
              textColor={textColor}
              actionIconColor={actionIconColor}
              onClick={() => {
                setOpened(false);
                onOpenOrderHistory?.();
              }}
            />
          </Stack>

          <Divider color={dividerColor} />

          <Stack gap={8}>
            <Text fw={800} fz="0.76rem" c={sectionColor}>
              {t("settings.profileSection")}
            </Text>

            <SettingRow
              icon={<IconLanguage size={20} stroke={1.9} />}
              label={t("settings.language")}
              titleColor={titleColor}
              textColor={textColor}
              rowBg={rowBg}
            >
                <SegmentedControl
                  radius="xl"
                  size="xs"
                  w={108}
                  value={locale}
                  onChange={(value) => onLocaleChange(value as Locale)}
                data={[
                  { label: "UZ", value: "uz" },
                  { label: "RU", value: "ru" },
                ]}
                styles={{
                  root: {
                    background: isDark ? "#2f3641" : "#e9edf3",
                    padding: 3,
                  },
                  control: {
                    minWidth: 36,
                  },
                  indicator: {
                    background: isDark ? "#3a4350" : "#ffffff",
                    boxShadow: isDark
                      ? "0 3px 10px rgba(0,0,0,0.22)"
                      : "0 2px 8px rgba(15,23,42,0.08)",
                  },
                  label: {
                    minHeight: 24,
                    paddingInline: 8,
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    color: isDark ? "#d9dee7" : textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </SettingRow>

            <SettingRow
              icon={<IconMoonStars size={20} stroke={1.9} />}
              label={t("settings.darkMode")}
              titleColor={titleColor}
              textColor={textColor}
              rowBg={rowBg}
            >
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
            </SettingRow>

            {phoneNumbers && phoneNumbers.length > 0 ? (
              <SettingRow
                icon={<IconHeadset size={20} stroke={1.9} />}
                label={t("settings.phoneNumbers")}
                description={phoneNumbers.join(", ")}
                titleColor={titleColor}
                textColor={textColor}
                rowBg={rowBg}
              >
                <Box />
              </SettingRow>
            ) : null}
          </Stack>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  text: string;
  titleColor: string;
  textColor: string;
}

function InfoRow({ icon, text, titleColor, textColor }: InfoRowProps) {
  return (
    <Group gap={8} wrap="nowrap" align="center">
      <Box c={textColor} style={{ flexShrink: 0, lineHeight: 0 }}>
        {icon}
      </Box>
      <Text fw={700} fz="0.84rem" c={titleColor} style={{ minWidth: 0 }}>
        {text}
      </Text>
    </Group>
  );
}

interface MenuActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  titleColor: string;
  textColor: string;
  actionIconColor: string;
}

function MenuAction({
  icon,
  label,
  onClick,
  titleColor,
  textColor,
  actionIconColor,
}: MenuActionProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: "100%",
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap={8} wrap="nowrap" align="center" style={{ minWidth: 0 }}>
          <Box c={textColor} style={{ flexShrink: 0, lineHeight: 0 }}>
            {icon}
          </Box>
          <Text fw={700} fz="0.84rem" c={titleColor} truncate>
            {label}
          </Text>
        </Group>

        <Box c={actionIconColor} style={{ flexShrink: 0, lineHeight: 0 }}>
          <IconChevronRight size={18} stroke={2} />
        </Box>
      </Group>
    </UnstyledButton>
  );
}

interface SettingRowProps {
  icon: ReactNode;
  label: string;
  description?: string;
  titleColor: string;
  textColor: string;
  rowBg: string;
  children: ReactNode;
}

function SettingRow({
  icon,
  label,
  description,
  titleColor,
  textColor,
  rowBg,
  children,
}: SettingRowProps) {
  return (
    <Group
      justify="space-between"
      align="center"
      wrap="nowrap"
      px={8}
      py={7}
      style={{
        background: rowBg,
        borderRadius: 14,
      }}
    >
      <Group gap={8} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
        <Box c={textColor} style={{ flexShrink: 0, lineHeight: 0 }}>
          {icon}
        </Box>
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text fw={700} fz="0.8rem" c={titleColor} lh={1.15} truncate>
            {label}
          </Text>
          {description ? (
            <Text
              fz="0.66rem"
              c={textColor}
              lh={1.2}
              style={{ minWidth: 0 }}
            >
              {description}
            </Text>
          ) : null}
        </Stack>
      </Group>

      {children}
    </Group>
  );
}
