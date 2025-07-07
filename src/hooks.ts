import { useCallback, useContext, useEffect, useRef } from "react";
import { type MapRef, useMap } from "react-map-gl/maplibre";
import { sanitizeBbox } from "./components/stac/utils";
import { StacMapContext } from "./context";
import { getPadding } from "./utils";

export function useStacMap() {
  const context = useContext(StacMapContext);
  if (context) {
    return context;
  } else {
    throw new Error("useStacMap must be used from within a StacMapProvider");
  }
}

export function useFitBbox() {
  const { map } = useMap();
  const mapRef = useRef<MapRef>(null);

  const callback = useCallback((bbox: number[]) => {
    if (mapRef.current) {
      const sanitizedBbox = sanitizeBbox(bbox);
      mapRef.current.fitBounds(sanitizedBbox, { padding: getPadding() });
    }
  }, []);

  useEffect(() => {
    if (map) {
      mapRef.current = map;
    }
  }, [map]);

  return callback;
}

export function useIsCollectionSelected(id: string) {
  const { selectedCollections } = useStacMap();
  return selectedCollections.has(id);
}
