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

export function TerritoryMap({ points }: { points: TerritoryMapPoint[] }) {
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

      const instance = new Map({
        container: node,
        style: STYLE_URL,
        bounds: BOUNDS,
        fitBoundsOptions: { padding: 32 },
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
      className="h-150 w-full"
      role="img"
      aria-label="Map of São Tomé and Príncipe showing where interventions are located"
    />
  );
}
