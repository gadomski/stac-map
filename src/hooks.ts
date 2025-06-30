import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { type MapRef, useMap } from "react-map-gl/maplibre";
import type { StacCollection } from "stac-ts";
import { sanitizeBbox } from "./components/stac/utils";
import {
  LayersDispatchContext,
  SelectedContext,
  SelectedDispatchContext,
} from "./context";

export function useSelected() {
  const state = useContext(SelectedContext);
  if (state) {
    return state;
  } else {
    throw new Error(
      "useSelected must be used inside of an SelectedStateProvider",
    );
  }
}

export function useSelectedDispatch() {
  const dispatch = useContext(SelectedDispatchContext);
  if (dispatch) {
    return dispatch;
  } else {
    throw new Error("need to set up selected state dispatch context");
  }
}

export function useLayersDispatch() {
  const dispatch = useContext(LayersDispatchContext);
  if (dispatch) {
    return dispatch;
  } else {
    throw new Error("need to set up dispatch");
  }
}

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

export function useIsCollectionSelected(collection: StacCollection) {
  const { collectionIds } = useSelected();
  const [isCollectionSelected, setIsCollectionSelected] = useState(false);

  useEffect(() => {
    setIsCollectionSelected(!!collectionIds.has(collection.id));
  }, [setIsCollectionSelected, collectionIds, collection.id]);

  return isCollectionSelected;
}
