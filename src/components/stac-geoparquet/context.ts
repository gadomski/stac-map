import { createContext, type Dispatch } from "react";

export type StacGeoparquetState = {
  path?: string;
  metadata?: StacGeoparquetMetadata;
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
  | { type: "set-metadata"; metadata: StacGeoparquetMetadata };

export const StacGeoparquetContext =
  createContext<StacGeoparquetContextType | null>(null);
