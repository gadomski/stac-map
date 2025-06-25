import { Layer } from "@deck.gl/core";
import { LngLatBounds } from "maplibre-gl";
import { createContext, useContext, type Dispatch } from "react";

export type MapState = {
  layers: Layer[];
  fitBounds?: LngLatBounds;
};

export type MapAction =
  | {
      type: "set-layers";
      layers: Layer[];
    }
  | { type: "set-fit-bbox"; bbox: number[] };

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

export function reduceMapAction(state: MapState, action: MapAction) {
  switch (action.type) {
    case "set-layers":
      return {
        ...state,
        layers: action.layers,
        fitBounds: (action.bbox && bboxToBounds(action.bbox)) || undefined,
        picked: undefined,
      };
    case "set-fit-bbox":
      return { ...state, fitBounds: bboxToBounds(action.bbox) };
  }
}

function bboxToBounds(bbox: number[]) {
  if (bbox.length == 4) {
    return new LngLatBounds([bbox[0], bbox[1], bbox[2], bbox[3]]);
  } else if (bbox.length == 6) {
    return new LngLatBounds([bbox[0], bbox[1], bbox[3], bbox[4]]);
  } else {
    console.log("ERROR: invalid bbox=" + bbox);
  }
}
