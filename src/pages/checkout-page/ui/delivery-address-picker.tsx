import { ActionIcon, Box, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconMapPin } from "@tabler/icons-react";
import { useBrandTheme } from "../../../app/providers/brand-theme-context";

interface DeliveryAddressPickerProps {
  value: string;
  onChange: (value: string) => void;
  titleColor: string;
  textColor: string;
  surfaceBg: string;
  mutedBg: string;
  isDark: boolean;
}

const YANDEX_MAPS_SCRIPT_ID = "yandex-maps-api-script";
const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
const DEFAULT_CENTER: [number, number] = [41.2995, 69.2401];

interface NominatimReverseResponse {
  display_name?: string;
}

function loadYandexMapsScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.ymaps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      YANDEX_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load map.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    const query = YANDEX_MAPS_API_KEY ? `&apikey=${YANDEX_MAPS_API_KEY}` : "";
    script.id = YANDEX_MAPS_SCRIPT_ID;
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${query}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load map."));
    document.head.appendChild(script);
  });
}

async function reverseGeocodeWithNominatim(
  latitude: number,
  longitude: number,
  language: string,
) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${encodeURIComponent(language)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to reverse geocode.");
  }

  const data = (await response.json()) as NominatimReverseResponse;
  return data.display_name?.trim() || "";
}

export function DeliveryAddressPicker({
  value,
  onChange,
  titleColor,
  textColor,
  surfaceBg,
  mutedBg,
  isDark,
}: DeliveryAddressPickerProps) {
  const { t, i18n } = useTranslation();
  const { brandColor } = useBrandTheme();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YandexMapInstance | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const locale = i18n.resolvedLanguage === "uz" ? "uz" : "ru";

  function updatePlacemark(latitude: number, longitude: number, label: string) {
    const map = mapInstanceRef.current;
    if (!map || !window.ymaps) {
      return;
    }

    map.geoObjects.removeAll();
    const placemark = new window.ymaps.Placemark(
      [latitude, longitude],
      {
        hintContent: label,
        balloonContent: label,
      },
      {
        preset: "islands#dotIcon",
        iconColor: brandColor,
      },
    );

    map.geoObjects.add(placemark);
    map.setCenter?.([latitude, longitude], 16, {
      checkZoomRange: true,
      duration: 250,
    });
  }

  function selectCoordinates(latitude: number, longitude: number) {
    setIsResolvingAddress(true);
    setMapError(null);

    void reverseGeocodeWithNominatim(latitude, longitude, locale)
      .then((address) => {
        if (!address) {
          setMapError(t("checkout.addressNotFound"));
          onChange("");
          return;
        }

        updatePlacemark(latitude, longitude, address);
        onChange(address);
        setMapError(null);
      })
      .catch(() => {
        setMapError(t("checkout.addressNotFound"));
        onChange("");
      })
      .finally(() => {
        setIsResolvingAddress(false);
      });
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setMapError(t("checkout.addressLocationUnavailable"));
      return;
    }

    setIsLocatingUser(true);
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        selectCoordinates(latitude, longitude);
        setIsLocatingUser(false);
      },
      () => {
        setMapError(t("checkout.addressLocationUnavailable"));
        setIsLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    let cancelled = false;

    void loadYandexMapsScript()
      .then(() => {
        if (cancelled || !mapRef.current || !window.ymaps) {
          return;
        }

        window.ymaps.ready(() => {
          if (cancelled || !mapRef.current || !window.ymaps) {
            return;
          }

          mapInstanceRef.current?.destroy();

          const map = new window.ymaps.Map(
            mapRef.current,
            {
              center: DEFAULT_CENTER,
              zoom: 12,
              controls: ["zoomControl", "geolocationControl"],
            },
            {
              suppressMapOpenBlock: true,
            },
          );

          map.events.add("click", (event: unknown) => {
            const coords = (event as { get?: (name: string) => unknown })
              .get?.("coords") as number[] | undefined;

            if (!coords || coords.length < 2) {
              return;
            }

            const latitude = coords[0];
            const longitude = coords[1];
            selectCoordinates(latitude, longitude);
          });

          mapInstanceRef.current = map;
          setMapError(null);
          locateUser();
        });
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(t("checkout.addressMapUnavailable"));
        }
      });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [brandColor, locale, onChange, t]);

  function openYandexRoute() {
    locateUser();
  }

  return (
    <Stack gap="md">
      <Paper
        radius={20}
        p="md"
        style={{
          background: surfaceBg,
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(17,24,39,0.08)",
        }}
      >
        <Stack gap={4}>
          <Text fw={800} c={titleColor}>
            {t("checkout.addressMapTitle")}
          </Text>
          <Text size="sm" c={textColor}>
            {t("checkout.addressMapDescription")}
          </Text>
        </Stack>
      </Paper>

      <Box style={{ position: "relative" }}>
        <Box
          ref={mapRef}
          style={{
            minHeight: 320,
            height: "42dvh",
            width: "100%",
            overflow: "hidden",
            borderRadius: 24,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(17,24,39,0.08)",
          }}
        />

        <ActionIcon
          size={42}
          radius="xl"
          color={brandColor}
          variant="filled"
          aria-label={t("checkout.addressLocateMe")}
          onClick={openYandexRoute}
          loading={isLocatingUser}
          style={{
            position: "absolute",
            right: 14,
            bottom: 14,
            zIndex: 2,
            boxShadow: isDark
              ? "0 10px 22px rgba(0,0,0,0.32)"
              : "0 10px 22px rgba(15,23,42,0.16)",
          }}
        >
          <IconMapPin size={18} />
        </ActionIcon>
      </Box>

      <Paper
        radius={18}
        p="md"
        style={{
          background: mutedBg,
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(17,24,39,0.08)",
        }}
      >
        <Text size="sm" fw={700} c={titleColor}>
          {t("checkout.selectedAddress")}
        </Text>
        <Text size="sm" c={textColor} mt={4}>
          {isResolvingAddress || isLocatingUser
            ? t("checkout.addressResolving")
            : value || t("checkout.addressPlaceholder")}
        </Text>
        {mapError ? (
          <Text size="xs" c="red.6" mt={8}>
            {mapError}
          </Text>
        ) : null}
      </Paper>
    </Stack>
  );
}
