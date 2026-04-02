import { ActionIcon, Box, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

interface FloatingCartButtonProps {
  totalCount: number;
  isDark: boolean;
  onClick: () => void;
}

export function FloatingCartButton({
  totalCount,
  isDark,
  onClick,
}: FloatingCartButtonProps) {
  return (
    <ActionIcon
      size={56}
      radius="xl"
      variant="filled"
      color="orange"
      onClick={onClick}
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 1,
        boxShadow: isDark
          ? "0 12px 24px rgba(0, 0, 0, 0.35)"
          : "0 12px 24px rgba(17, 24, 39, 0.18)",
      }}
    >
      <Box style={{ position: "relative", display: "grid", placeItems: "center" }}>
        <IconShoppingCart size={24} />
        {totalCount > 0 ? (
          <Box
            style={{
              position: "absolute",
              top: -9,
              right: -11,
              minWidth: 20,
              height: 20,
              borderRadius: 999,
              padding: "0 6px",
              background: "#151515",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            <Text size="10px" fw={800} c="white" lh={1}>
              {totalCount}
            </Text>
          </Box>
        ) : null}
      </Box>
    </ActionIcon>
  );
}
