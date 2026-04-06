import { Box, Button, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Partner } from "../../../types/partner";

declare global {
  interface Window {
    ymaps?: {
      Map: new (element: HTMLElement, state: unknown, options?: unknown) => {
        destroy: () => void;
        geoObjects: {
          add: (geoObject: unknown) => void;
          removeAll: () => void;
        };
        setBounds?: (bounds: number[][], options?: unknown) => void;
      };
      Placemark: new (
        coords: number[],
        properties?: Record<string, unknown>,
        options?: Record<string, unknown>,
      ) => {
        events: {
          add: (eventName: string, handler: () => void) => void;
        };
      };
      ready: (callback: () => void) => void;
    };
  }
}

interface PartnerMapPickerProps {
  partners: Partner[];
  selectedPartnerId: string;
  onSelectPartner: (partnerId: string) => void;
  titleColor: string;
  textColor: string;
  surfaceBg: string;
  mutedBg: string;
  isDark: boolean;
}

interface PartnerWithCoordinates {
  partner: Partner;
  coordinates: [number, number];
}

const YANDEX_MAPS_SCRIPT_ID = "yandex-maps-api-script";
const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getPartnerCoordinates(partner: Partner): [number, number] | null {
  const latitude = toNumber(
    partner.latitude ?? partner.lat ?? partner.location_lat ?? partner.geo_lat,
  );
  const longitude = toNumber(
    partner.longitude ??
      partner.lng ??
      partner.lon ??
      partner.location_lng ??
      partner.location_lon ??
      partner.geo_lng ??
      partner.geo_lon,
  );

  if (latitude === null || longitude === null) {
    return null;
  }

  return [latitude, longitude];
}

function getBounds(points: [number, number][]) {
  const latitudes = points.map(([latitude]) => latitude);
  const longitudes = points.map(([, longitude]) => longitude);

  return [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)],
  ];
}

function getPartnerLabel(partner: Partner) {
  return (
    partner.name ??
    partner.full_name ??
    partner.title ??
    partner.phone ??
    partner.phone_number ??
    partner.id
  );
}

function loadYandexMapsScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.ymaps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(YANDEX_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load map.")), {
        once: true,
      });
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

export function PartnerMapPicker({
  partners,
  selectedPartnerId,
  onSelectPartner,
  titleColor,
  textColor,
  surfaceBg,
  mutedBg,
  isDark,
}: PartnerMapPickerProps) {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<{
    destroy: () => void;
    geoObjects: {
      add: (geoObject: unknown) => void;
      removeAll: () => void;
    };
    setBounds?: (bounds: number[][], options?: unknown) => void;
  } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const partnersWithCoordinates = useMemo<PartnerWithCoordinates[]>(
    () =>
      partners
        .map((partner) => {
          const coordinates = getPartnerCoordinates(partner);

          return coordinates ? { partner, coordinates } : null;
        })
        .filter((item): item is PartnerWithCoordinates => item !== null),
    [partners],
  );

  useEffect(() => {
    if (!mapRef.current || partnersWithCoordinates.length === 0) {
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

          const initialCoordinates = partnersWithCoordinates[0]?.coordinates ?? [41.3111, 69.2797];
          const map = new window.ymaps.Map(
            mapRef.current,
            {
              center: initialCoordinates,
              zoom: 12,
              controls: ["zoomControl", "geolocationControl"],
            },
            {
              suppressMapOpenBlock: true,
            },
          );

          partnersWithCoordinates.forEach(({ partner, coordinates }) => {
            const isActive = partner.id === selectedPartnerId;
            const placemark = new window.ymaps!.Placemark(
              coordinates,
              {
                balloonContentHeader: getPartnerLabel(partner),
                balloonContentBody: partner.phone ?? partner.phone_number ?? partner.id,
                hintContent: getPartnerLabel(partner),
              },
              {
                preset: isActive ? "islands#orangeDotIcon" : "islands#blueDotIcon",
              },
            );

            placemark.events.add("click", () => {
              onSelectPartner(partner.id);
            });

            map.geoObjects.add(placemark);
          });

          const points = partnersWithCoordinates.map(({ coordinates }) => coordinates);
          if (points.length > 1) {
            map.setBounds?.(getBounds(points), {
              checkZoomRange: true,
              zoomMargin: 32,
            });
          }

          mapInstanceRef.current = map;
          setMapError(null);
        });
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(t("checkout.partnerMapUnavailable"));
        }
      });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [onSelectPartner, partnersWithCoordinates, selectedPartnerId, t]);

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
            {t("checkout.partnerMapTitle")}
          </Text>
          <Text size="sm" c={textColor}>
            {t("checkout.partnerMapDescription")}
          </Text>
        </Stack>
      </Paper>

      {partnersWithCoordinates.length > 0 ? (
        <Box
          ref={mapRef}
          style={{
            minHeight: 360,
            height: "52dvh",
            width: "100%",
            overflow: "hidden",
            borderRadius: 24,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(17,24,39,0.08)",
          }}
        />
      ) : (
        <Paper
          radius={20}
          p="lg"
          style={{
            background: mutedBg,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(17,24,39,0.08)",
          }}
        >
          <Text fw={700} c={titleColor}>
            {t("checkout.partnerNoCoordinates")}
          </Text>
        </Paper>
      )}

      {mapError ? (
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
          <Text size="sm" c={textColor}>
            {mapError}
          </Text>
          {!YANDEX_MAPS_API_KEY ? (
            <Text size="xs" c={textColor} mt={6}>
              VITE_YANDEX_MAPS_API_KEY
            </Text>
          ) : null}
        </Paper>
      ) : null}

      <ScrollArea offsetScrollbars scrollbarSize={4}>
        <Group wrap="nowrap" gap="sm">
          {partners.map((partner) => {
            const active = partner.id === selectedPartnerId;

            return (
              <Paper
                key={partner.id}
                radius={20}
                p="md"
                style={{
                  minWidth: 220,
                  background: active ? mutedBg : surfaceBg,
                  border: active
                    ? "1px solid #f78f26"
                    : isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(17,24,39,0.08)",
                }}
              >
                <Stack gap="sm">
                  <Stack gap={2}>
                    <Text fw={800} c={titleColor}>
                      {getPartnerLabel(partner)}
                    </Text>
                    <Text size="xs" c={textColor}>
                      {partner.phone ?? partner.phone_number ?? partner.id}
                    </Text>
                  </Stack>

                  <Button
                    radius="xl"
                    color={active ? "orange" : "gray"}
                    variant={active ? "filled" : "light"}
                    onClick={() => onSelectPartner(partner.id)}
                  >
                    {active ? t("checkout.partnerSelectedAction") : t("checkout.choosePartner")}
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Group>
      </ScrollArea>
    </Stack>
  );
}
