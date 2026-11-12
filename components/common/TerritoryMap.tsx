"use client";

import { useEffect, useRef } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

export interface TerritoryMapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color?: string;
}

/** Free vector basemap — no API key, no signup. */
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Self-hosted copy of MapLibre's worker — see scripts/copy-maplibre-worker.mjs. */
const WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

/**
 * OpenStreetMap data is ODbL-licensed, so attribution is legally required.
 * The OpenFreeMap style doesn't declare it on its sources, so MapLibre can't
 * pick it up automatically — it has to be set explicitly here.
 */
const ATTRIBUTION =
  '<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

/** Frames both islands: São Tomé in the south, Príncipe to the north-east. */
const BOUNDS: [[number, number], [number, number]] = [
  [6.35, -0.08],
  [7.6, 1.82],
];

export function TerritoryMap({
  points,
  ariaLabel = "Map of São Tomé and Príncipe showing where initiatives are located",
}: {
  points: TerritoryMapPoint[];
  ariaLabel?: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    (async () => {
      // Imported here rather than at module scope: maplibre-gl touches `window`
      // on import, which would break server rendering of this component's shell.
      // v6 has no default export — everything is a named export.
      const { Map, Marker, Popup, AttributionControl, setWorkerUrl } =
        await import("maplibre-gl");
      if (cancelled) return;

      // maplibre-gl resolves its worker relative to its own bundle URL, which
      // doesn't survive Turbopack bundling — the request 404s and the map
      // renders blank with "Worker failed to load". Point it at our own copy
      // instead (kept in sync by scripts/copy-maplibre-worker.mjs).
      setWorkerUrl(WORKER_URL);

      // A single point (per-initiative map) centers and zooms in on it
      // directly — fitting it to the same whole-country BOUNDS as the
      // multi-point site-wide map would just show a tiny, barely-visible
      // dot in the same wide view every time.
      const instance = new Map({
        container: node,
        style: STYLE_URL,
        ...(points.length === 1
          ? { center: [points[0].lng, points[0].lat] as [number, number], zoom: 10 }
          : { bounds: BOUNDS, fitBoundsOptions: { padding: 32 } }),
        // Locked: no panning, zooming, rotating. Also means the map can never
        // hijack page scroll as a visitor scrolls past the block.
        interactive: false,
        attributionControl: false,
      });
      map = instance;

      instance.addControl(
        new AttributionControl({
          compact: true,
          customAttribution: ATTRIBUTION,
        }),
      );

      // The "positron" style has no land fill — land is just the bare
      // background color showing through, so the islands had no visible
      // edge against the grey water. A flat fill painted over the style's
      // own water polygons, topped with a line layer along the same
      // polygons, gives plain water with a visible coastline border.
      instance.on("load", () => {
        if (cancelled) return;
        // Insert below the style's label/symbol layers — addLayer defaults
        // to the top of the stack, which painted our white fill directly
        // over the "São Tomé"/"Príncipe" place labels.
        const firstSymbolLayerId = instance
          .getStyle()
          ?.layers?.find((layer) => layer.type === "symbol")?.id;
        instance.addLayer(
          {
            id: "water-fill",
            type: "fill",
            source: "openmaptiles",
            "source-layer": "water",
            filter: [
              "all",
              ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
              ["!=", ["get", "brunnel"], "tunnel"],
            ],
            paint: {
              "fill-color": "#f2ede9",
            },
          },
          firstSymbolLayerId,
        );
        instance.addLayer(
          {
            id: "water-outline",
            type: "line",
            source: "openmaptiles",
            "source-layer": "water",
            filter: [
              "all",
              ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
              ["!=", ["get", "brunnel"], "tunnel"],
            ],
            paint: {
              "line-color": "rgba(0, 0, 0, 0.65)",
              "line-width": 1.2,
            },
          },
          firstSymbolLayerId,
        );
      });

      for (const point of points) {
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", point.name);
        el.style.cssText = [
          "width:22px",
          "height:22px",
          "border-radius:9999px",
          "border:1.5px solid rgba(0,0,0,.65)",
          `background:${point.color ?? "#9DC3E6"}`,
          "cursor:default",
          "padding:0",
        ].join(";");

        const popup = new Popup({
          offset: 16,
          closeButton: false,
          closeOnClick: false,
          focusAfterOpen: false,
        }).setText(point.name);

        const show = () =>
          popup.setLngLat([point.lng, point.lat]).addTo(instance);
        const hide = () => popup.remove();

        // Keyboard users get the same information as mouse users.
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
        el.addEventListener("focus", show);
        el.addEventListener("blur", hide);

        new Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .addTo(instance);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [points]);

  return (
    <div
      ref={container}
      className="h-full w-full"
      role="img"
      aria-label={ariaLabel}
    />
  );
}
