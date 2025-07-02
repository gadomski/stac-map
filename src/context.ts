import type { Layer } from "@deck.gl/core";
import { createContext, type Dispatch } from "react";
import type { StacCollection } from "stac-ts";

export interface AppState {
  layer: Layer | null;
  collections: StacCollection[];
  selectedCollectionIds: Set<string>;
}

export type AppAction =
  | { type: "set-layer"; layer: Layer }
  | { type: "set-collections"; collections: StacCollection[] }
  | { type: "select-collection"; id: string }
  | { type: "deselect-collection"; id: string }
  | { type: "deselect-all-collections" };

export const AppContext = createContext<AppState | null>(null);
export const AppDispatchContext = createContext<Dispatch<AppAction> | null>(
  null,
);

export function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case "set-layer":
      return { ...state, layer: action.layer };
    case "set-collections":
      return { ...state, collections: action.collections };
    case "select-collection":
      return {
        ...state,
        selectedCollectionIds: new Set([
          ...state.selectedCollectionIds,
          action.id,
        ]),
      };
    case "deselect-collection":
      state.selectedCollectionIds.delete(action.id);
      return {
        ...state,
        selectedCollectionIds: new Set([...state.selectedCollectionIds]),
      };
    case "deselect-all-collections":
      return { ...state, selectedCollectionIds: new Set<string>() };
  }
}
