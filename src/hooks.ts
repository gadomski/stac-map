import { useCallback, useContext, useEffect, useRef } from "react";
import { type MapRef, useMap } from "react-map-gl/maplibre";
import { sanitizeBbox } from "./components/stac/utils";
import { AppContext, AppDispatchContext } from "./context";

export function useFitBbox() {
  const { map } = useMap();
  const mapRef = useRef<MapRef>(null);

  const callback = useCallback((bbox: number[]) => {
    if (mapRef.current) {
      const sanitizedBbox = sanitizeBbox(bbox);
      const padding = {
        top: window.innerHeight / 10,
        bottom: window.innerHeight / 20,
        right: window.innerWidth / 20,
        // TODO fix for smaller viewport
        left: window.innerWidth / 20 + window.innerWidth / 3,
      };
      mapRef.current.fitBounds(sanitizedBbox, { padding });
    }
  }, []);

  useEffect(() => {
    if (map) {
      mapRef.current = map;
    }
  }, [map]);

  return callback;
}

export function useAppState() {
  const state = useContext(AppContext);
  if (state) {
    return state;
  } else {
    throw new Error("app state is not defined");
  }
}

export function useAppDispatch() {
  const dispatch = useContext(AppDispatchContext);
  if (dispatch) {
    return dispatch;
  } else {
    throw new Error("app dispatch is not defined");
  }
}

export function useCollectionSelected(id: string) {
  const { selectedCollectionIds } = useAppState();
  return selectedCollectionIds.has(id);
}

export function useSelectedCollections() {
  const { selectedCollectionIds, collections } = useAppState();
  return collections.filter((collection) =>
    selectedCollectionIds.has(collection.id),
  );
}
