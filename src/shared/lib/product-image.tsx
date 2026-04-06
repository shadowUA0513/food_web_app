import { Badge, Box, Stack, Text } from "@mantine/core";
import { IconChefHat } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  h?: CSSProperties["height"];
  w?: CSSProperties["width"];
  radius?: CSSProperties["borderRadius"];
  fit?: CSSProperties["objectFit"];
  background?: string;
  badge?: ReactNode;
}

const fallbackThemes = [
  {
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.28), transparent 52%), linear-gradient(135deg, #ffb347 0%, #ff8c42 48%, #d95d39 100%)",
    shadow: "rgba(217,93,57,0.22)",
  },
  {
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.24), transparent 52%), linear-gradient(135deg, #8ec5fc 0%, #5fa8ff 52%, #3c67e3 100%)",
    shadow: "rgba(60,103,227,0.22)",
  },
  {
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.24), transparent 52%), linear-gradient(135deg, #7ee8a5 0%, #33c38e 50%, #16806d 100%)",
    shadow: "rgba(22,128,109,0.2)",
  },
  {
    background:
      "radial-gradient(circle at top, rgba(255,255,255,0.22), transparent 52%), linear-gradient(135deg, #f6d365 0%, #fda085 52%, #e76f51 100%)",
    shadow: "rgba(231,111,81,0.22)",
  },
];

function getInitials(value: string) {
  const words = value
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "FD";
  }

  return words
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function getThemeIndex(value: string) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function ProductImage({
  src,
  alt,
  h = "100%",
  w = "100%",
  radius = 0,
  fit = "contain",
  background,
  badge,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = src?.trim() ?? "";

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  const initials = useMemo(() => getInitials(alt), [alt]);
  const theme = useMemo(
    () => fallbackThemes[getThemeIndex(alt) % fallbackThemes.length],
    [alt],
  );
  const shouldShowImage = normalizedSrc.length > 0 && !hasError;

  if (shouldShowImage) {
    return (
      <Box
        component="img"
        src={normalizedSrc}
        alt={alt}
        h={h}
        w={w}
        style={{
          display: "block",
          width: w,
          height: h,
          objectFit: fit,
          borderRadius: radius,
        }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Box
      h={h}
      w={w}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        background: background ?? theme.background,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 28px ${theme.shadow}`,
      }}
    >
      <Box
        style={{
          position: "absolute",
          inset: "auto -10% -28% auto",
          width: "68%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.14)",
          filter: "blur(1px)",
        }}
      />
      <Box
        style={{
          position: "absolute",
          inset: "-20% auto auto -12%",
          width: "42%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
        }}
      />

      <Stack
        align="center"
        justify="center"
        gap={8}
        h="100%"
        px="sm"
        style={{ position: "relative", zIndex: 1 }}
      >
        {badge ?? (
          <Badge
            size="lg"
            radius="xl"
            color="rgba(255,255,255,0.18)"
            variant="filled"
            styles={{
              root: {
                background: "rgba(255,255,255,0.18)",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
              },
            }}
            leftSection={<IconChefHat size={14} />}
          >
            {initials}
          </Badge>
        )}

        <Text
          c="#ffffff"
          fw={800}
          ta="center"
          lineClamp={2}
          maw="85%"
          style={{ textWrap: "balance" }}
        >
          {alt}
        </Text>
      </Stack>
    </Box>
  );
}
