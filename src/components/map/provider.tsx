import { LngLatBounds } from "maplibre-gl";
import { type ReactNode, useReducer } from "react";
import { type LayersAction, type LayersState, LayersContext } from "./context";

export function LayersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { layers: [] });
  return <LayersContext value={{ state, dispatch }}>{children}</LayersContext>;
}

function reducer(state: LayersState, action: LayersAction) {
  switch (action.type) {
    case "set-layers":
      return {
        ...state,
        layers: action.layers,
        bounds: (action.bbox && bboxToBounds(action.bbox)) || undefined,
        picked: undefined,
      };
    case "set-bbox":
      return { ...state, bounds: bboxToBounds(action.bbox) };
    case "set-picked":
      return {
        ...state,
        picked: action.picked,
      };
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
