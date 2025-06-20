import type { Table } from "apache-arrow";
import { createContext, type Dispatch } from "react";

export type StacGeoparquetState = {
  path?: string;
  metadata?: StacGeoparquetMetadata;
  table?: Table;
};

type StacGeoparquetContextType = {
  state: StacGeoparquetState;
  dispatch: Dispatch<StacGeoparquetAction>;
};

type StacGeoparquetMetadata = {
  count: number;
};

export type StacGeoparquetAction =
  | { type: "set-path"; path: string }
  | { type: "set-metadata"; metadata: StacGeoparquetMetadata }
  | { type: "set-table"; table: Table };

export const StacGeoparquetContext =
  createContext<StacGeoparquetContextType | null>(null);
