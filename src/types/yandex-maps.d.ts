declare global {
  interface YandexMapGeoObjects {
    add: (geoObject: unknown) => void;
    removeAll: () => void;
  }

  interface YandexMapEvents {
    add: (eventName: string, handler: (event: unknown) => void) => void;
  }

  interface YandexPlacemarkEvents {
    add: (eventName: string, handler: (event: unknown) => void) => void;
  }

  interface YandexMapInstance {
    destroy: () => void;
    geoObjects: YandexMapGeoObjects;
    events: YandexMapEvents;
    setBounds?: (bounds: number[][], options?: unknown) => void;
    setCenter?: (center: number[], zoom?: number, options?: unknown) => void;
  }

  interface YandexPlacemarkInstance {
    events: YandexPlacemarkEvents;
  }

  interface YandexMapsApi {
    Map: new (
      element: HTMLElement,
      state: unknown,
      options?: unknown,
    ) => YandexMapInstance;
    Placemark: new (
      coords: number[],
      properties?: Record<string, unknown>,
      options?: Record<string, unknown>,
    ) => YandexPlacemarkInstance;
    ready: (callback: () => void) => void;
  }

  interface Window {
    ymaps?: YandexMapsApi;
  }
}

export {};
