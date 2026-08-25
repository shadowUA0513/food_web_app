import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import defaultProductImage from "../../assets/default-img4.png";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  h?: CSSProperties["height"];
  w?: CSSProperties["width"];
  radius?: CSSProperties["borderRadius"];
  fit?: CSSProperties["objectFit"];
  background?: string;
}

export function ProductImage({
  src,
  alt,
  h = "100%",
  w = "100%",
  radius = 0,
  fit = "contain",
  background,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = src?.trim() ?? "";
  const isFallback = normalizedSrc.length === 0 || hasError;

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  const shouldShowImage = normalizedSrc.length > 0 && !hasError;
  const fallbackSrc = defaultProductImage;

  return (
    <Box
      component="img"
      src={shouldShowImage ? normalizedSrc : fallbackSrc}
      alt={alt}
      h={h}
      w={w}
      style={{
        display: "block",
        width: w,
        height: h,
        objectFit: fit,
        borderRadius: radius,
        background: isFallback
          ? (background ?? "#ffffff")
          : (background ?? "transparent"),
      }}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
