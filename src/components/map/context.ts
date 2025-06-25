import { LngLatBounds } from "maplibre-gl";
import { createContext, useContext, type Dispatch } from "react";

export type MapState = {
  fitBounds?: LngLatBounds;
  bounds?: LngLatBounds;
};

export type MapAction =
  | { type: "set-fit-bbox"; bbox: number[] }
  | { type: "set-bounds"; bounds: LngLatBounds };

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
    case "set-fit-bbox":
      return { ...state, fitBounds: bboxToBounds(action.bbox) };
    case "set-bounds":
      return { ...state, bounds: clampBounds(action.bounds) };
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

function clampBounds(bounds: LngLatBounds) {
  if (bounds.getWest() < -180) {
    bounds.setSouthWest([-180, bounds.getSouth()]);
  }
  if (bounds.getEast() > 180) {
    bounds.setNorthEast([180, bounds.getNorth()]);
  }
  return bounds;
}
