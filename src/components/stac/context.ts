import type { Table } from "apache-arrow";
import { LngLatBounds } from "maplibre-gl";
import { createContext, type Dispatch } from "react";
import type { StacCatalog, StacCollection, StacLink } from "stac-ts";

export type StacState = {
  path?: string;
  container?: StacContainer;
  table?: Table;
  search?: string;
  id?: string;
};

type StacContextType = {
  state: StacState;
  dispatch: Dispatch<StacAction>;
};

export type StacContainer = StacCatalog | StacCollection | StacItemCollection;

/// A customized item collection for easy use with stac-geoparquet
export type StacItemCollection = {
  type: "FeatureCollection";
  id?: string;
  title?: string;
  description?: string;
  count: number;
  bounds: LngLatBounds;
  startDatetime: Date;
  endDatetime: Date;
  links?: StacLink[];
};

export type StacSearch = {
  bbox: number[];
  startDatetime: Date;
  endDatetime: Date;
};

export type StacAction =
  | { type: "set-path"; path: string }
  | { type: "set-container"; container: StacContainer }
  | { type: "set-table"; table: Table }
  | { type: "set-id"; id: string };

export const StacContext = createContext<StacContextType | null>(null);
