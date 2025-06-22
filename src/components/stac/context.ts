import type { Table } from "apache-arrow";
import { LngLatBounds } from "maplibre-gl";
import { createContext, type Dispatch } from "react";
import type { StacCatalog, StacCollection, StacItem, StacLink } from "stac-ts";

export type StacState = {
  path?: string;
  container?: StacContainer;
  table?: Table;
  searchEndpoint?: StacSearchEndpoint;
  bounds?: LngLatBounds;
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
  stac_version?: string;
  features?: StacItem[];
  id?: string;
  title?: string;
  description?: string;
  count: number;
  bounds: LngLatBounds;
  startDatetime: Date;
  endDatetime: Date;
  links?: StacLink[];
};

export type StacSearchEndpoint = {
  href: string;
  collections: StacCollection[];
};

export type StacSearch = {
  bbox: number[];
  collections: string[];
  startDatetime?: Date;
  endDatetime?: Date;
  maxItems: number;
};

export type StacAction =
  | { type: "set-path"; path: string; title?: string }
  | { type: "set-container"; container: StacContainer }
  | { type: "set-search-endpoint"; searchEndpoint: StacSearchEndpoint }
  | { type: "set-table"; table: Table }
  | { type: "set-id"; id: string }
  | { type: "set-bounds"; bounds: LngLatBounds };

export const StacContext = createContext<StacContextType | null>(null);
