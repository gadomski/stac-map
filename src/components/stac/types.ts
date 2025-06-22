import { Table } from "apache-arrow";
import type { Feature, FeatureCollection } from "geojson";
import { type Dispatch } from "react";
import type { StacCatalog, StacCollection, StacItem } from "stac-ts";

export type StacValue =
  | StacCatalog
  | StacCollection
  | StacItem
  | StacItemCollection;

export type StacItemCollection = {
  type: "FeatureCollection";
  features: StacItem[];
  [k: string]: unknown;
};

export type StacState = {
  href?: string;
  value?: StacValue;
  table?: Table;
  geojson?: Feature | FeatureCollection;
  bbox?: number[];
};

export type StacAction =
  | { type: "set-href"; href?: string }
  | { type: "set-value"; value: StacValue }
  | { type: "set-table"; table: Table }
  | { type: "set-bbox"; bbox: number[] };

export type StacContextType = {
  state: StacState;
  dispatch: Dispatch<StacAction>;
};
