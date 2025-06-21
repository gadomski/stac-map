import type { Table } from "apache-arrow";
import { LngLatBounds } from "maplibre-gl";
import { createContext, type Dispatch } from "react";
import type { StacItem } from "stac-ts";

export type StacGeoparquetState = {
  path?: string;
  metadata?: StacGeoparquetMetadata;
  search?: StacSearch;
  table?: Table;
  id?: string;
  item?: StacItem;
};

type StacGeoparquetContextType = {
  state: StacGeoparquetState;
  dispatch: Dispatch<StacGeoparquetAction>;
};

export type StacGeoparquetMetadata = {
  count: number;
  bounds: LngLatBounds;
  startDatetime: Date;
  endDatetime: Date;
};

export type StacSearch = {
  bbox: number[];
  startDatetime: Date;
  endDatetime: Date;
};

export type StacGeoparquetAction =
  | { type: "set-path"; path: string }
  | { type: "set-metadata"; metadata: StacGeoparquetMetadata }
  | { type: "set-search"; search: StacSearch }
  | { type: "set-table"; table: Table }
  | { type: "set-id"; id: string }
  | { type: "set-item"; item: StacItem };

export const StacGeoparquetContext =
  createContext<StacGeoparquetContextType | null>(null);
