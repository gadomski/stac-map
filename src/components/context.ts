import type { LngLatBounds } from "maplibre-gl";
import { createContext, type Dispatch } from "react";
import type { StacValue } from "./stac/types";

export type AppState = {
  picked: StacValue | null;
  selected: StacValue[];
  fitBounds: LngLatBounds | null;
};

export const AppStateContext = createContext<AppState | null>(null);
export const AppStateDispatchContext =
  createContext<Dispatch<AppStateAction> | null>(null);

export type AppStateAction =
  | {
      type: "pick";
      value?: StacValue;
    }
  | { type: "fit-bbox"; bbox: [number, number, number, number] }
  | { type: "select"; value: StacValue }
  | { type: "deselect"; value: StacValue }
  | { type: "deselect-all" };
