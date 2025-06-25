import { Layer } from "@deck.gl/core";
import type { LngLatBounds } from "maplibre-gl";
import { createContext, useContext, type Dispatch } from "react";

export type MapAction =
  | {
      type: "set-layers";
      layers: Layer[];
      bbox?: number[];
    }
  | { type: "set-fit-bbox"; bbox: number[] };

export type MapState = {
  layers: Layer[];
  fitBounds?: LngLatBounds;
};

type MapContextType = {
  state: MapState;
  dispatch: Dispatch<MapAction>;
};

export const LayersContext = createContext<MapContextType | null>(null);

export function useMap() {
  const context = useContext(LayersContext);
  if (context === null) {
    throw new Error("useMap must be used from within a MapProvider");
  } else {
    return context.state;
  }
}

export function useMapDispatch() {
  const context = useContext(LayersContext);
  if (context === null) {
    throw new Error("useLayersDispatch must be used from within a MapProvider");
  } else {
    return context.dispatch;
  }
}
