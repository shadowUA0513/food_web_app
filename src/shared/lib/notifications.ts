import { notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

interface ShowAppNotificationParams {
  title: string;
  message?: string;
  color?: string;
  icon?: ReactNode;
}

export function showAppNotification({
  title,
  message,
  color = "primary",
  icon,
}: ShowAppNotificationParams) {
  notifications.show({
    title,
    message,
    color,
    icon,
    radius: "xl",
    autoClose: 2200,
  });
}
