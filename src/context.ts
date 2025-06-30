import { Layer } from "@deck.gl/core";
import { createContext, type Dispatch } from "react";
import type { StacItem } from "stac-ts";

interface SelectedState {
  collectionIds: Set<string>;
  item: StacItem | null;
  stacGeoparquetId: string | null;
}

export type SelectedAction =
  | {
      type: "select-collection";
      id: string;
    }
  | { type: "deselect-collection"; id: string }
  | { type: "deselect-all-collections" }
  | { type: "select-stac-geoparquet-id"; id: string | null }
  | { type: "select-item"; item: StacItem | null };

export const SelectedContext = createContext<SelectedState | null>(null);

export const SelectedDispatchContext =
  createContext<Dispatch<SelectedAction> | null>(null);

export function selectedReducer(state: SelectedState, action: SelectedAction) {
  switch (action.type) {
    case "select-collection":
      return {
        ...state,
        collectionIds: new Set([...state.collectionIds, action.id]),
      };
    case "deselect-collection":
      state.collectionIds.delete(action.id);
      return {
        ...state,
        collectionIds: new Set([...state.collectionIds]),
      };
    case "deselect-all-collections":
      return { ...state, collectionIds: new Set<string>() };
    case "select-stac-geoparquet-id":
      return { ...state, stacGeoparquetId: action.id };
    case "select-item":
      return { ...state, item: action.item };
  }
}

interface LayersState {
  value: Layer | null;
  selected: Layer | null;
}

export type LayersAction =
  | { type: "set-value"; layer: Layer | null }
  | { type: "set-selected"; layer: Layer | null };

export const LayersDispatchContext =
  createContext<Dispatch<LayersAction> | null>(null);

export function layersReducer(state: LayersState, action: LayersAction) {
  switch (action.type) {
    case "set-value":
      return { ...state, value: action.layer };
    case "set-selected":
      return { ...state, selected: action.layer };
  }
}
