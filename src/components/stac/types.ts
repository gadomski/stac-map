import { Table } from "apache-arrow";
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
};

export type StacAction =
  | { type: "set-href"; href: string }
  | { type: "set-value"; value: StacValue }
  | { type: "set-table"; table: Table };

export type StacContextType = {
  state: StacState;
  dispatch: Dispatch<StacAction>;
};
