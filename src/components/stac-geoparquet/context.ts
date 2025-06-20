import type { Table } from "apache-arrow";
import { LngLatBounds } from "maplibre-gl";
import { createContext, type Dispatch } from "react";

export type StacGeoparquetState = {
  path?: string;
  metadata?: StacGeoparquetMetadata;
  table?: Table;
  id?: string;
};

type StacGeoparquetContextType = {
  state: StacGeoparquetState;
  dispatch: Dispatch<StacGeoparquetAction>;
};

export type StacGeoparquetMetadata = {
  count: number;
  bounds: LngLatBounds;
};

export type StacGeoparquetAction =
  | { type: "set-path"; path: string }
  | { type: "set-metadata"; metadata: StacGeoparquetMetadata }
  | { type: "set-table"; table: Table }
  | { type: "set-id"; id?: string };

export const StacGeoparquetContext =
  createContext<StacGeoparquetContextType | null>(null);
