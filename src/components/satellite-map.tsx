"use client";

import { useEffect, useRef } from "react";

/**
 * Reusable OpenLayers satellite-imagery viewer (trd.md §2 — Esri World
 * Imagery XYZ tiles, no API key, no Mapbox/Google). Used in the Projects
 * tab's completed-project drawer (changes-1.md §4) and reused as-is by the
 * Jan-Pramaan capture flow (another agent's surface, changes-1.md §6) —
 * kept generic (lat/lng props only, no project-specific logic) so both can
 * import it without coupling.
 */
export function SatelliteMap({
  lat,
  lng,
  zoom = 17,
  className = "",
  height = 240,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("ol/Map").default | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("ol/Map").default | undefined;

    async function init() {
      if (!containerRef.current) return;

      const [{ default: Map }, { default: View }, { default: TileLayer }, { default: XYZ }, proj] =
        await Promise.all([
          import("ol/Map"),
          import("ol/View"),
          import("ol/layer/Tile"),
          import("ol/source/XYZ"),
          import("ol/proj"),
        ]);

      if (cancelled || !containerRef.current) return;

      const center = proj.fromLonLat([lng, lat]);

      map = new Map({
        target: containerRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              attributions:
                "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
              maxZoom: 19,
            }),
          }),
        ],
        view: new View({ center, zoom }),
        controls: [],
      });

      // Simple marker at the project location — a small inline SVG dot via
      // an Overlay would need an extra import; a plain DOM pin overlay is
      // lighter for this single-marker use case.
      const { default: Overlay } = await import("ol/Overlay");
      if (cancelled) return;
      const pinEl = document.createElement("div");
      pinEl.style.width = "14px";
      pinEl.style.height = "14px";
      pinEl.style.borderRadius = "9999px";
      pinEl.style.background = "#E08A2E";
      pinEl.style.border = "2px solid #FBF8F2";
      pinEl.style.boxShadow = "0 0 0 2px rgba(20,20,43,0.4)";
      map.addOverlay(new Overlay({ element: pinEl, position: center, positioning: "center-center" }));

      mapRef.current = map;
    }

    init();

    return () => {
      cancelled = true;
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
    };
  }, [lat, lng, zoom]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-lg border border-ink-950/10 bg-ink-950/5 ${className}`}
      style={{ height }}
      role="img"
      aria-label="Satellite imagery of the project location"
    />
  );
}
