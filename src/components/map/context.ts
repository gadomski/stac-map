import { Layer } from "@deck.gl/core";
import type { LngLatBounds } from "maplibre-gl";
import { createContext, useContext, type Dispatch } from "react";

export type LayersAction =
  | {
      type: "set-layers";
      layers: Layer[];
      bbox?: number[];
    }
  | { type: "set-bbox"; bbox: number[] };

export type LayersState = {
  layers: Layer[];
  bounds?: LngLatBounds;
};

type LayersContextType = {
  state: LayersState;
  dispatch: Dispatch<LayersAction>;
};

export const LayersContext = createContext<LayersContextType | null>(null);

export function useLayers() {
  const context = useContext(LayersContext);
  if (context === null) {
    throw new Error("useLayers must be used from within a LayersProvider");
  } else {
    return context.state;
  }
}

export function useLayersDispatch() {
  const context = useContext(LayersContext);
  if (context === null) {
    throw new Error(
      "useLayersDispatch must be used from within a LayersProvider"
    );
  } else {
    return context.dispatch;
  }
}
