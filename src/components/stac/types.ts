import type { StacCatalog, StacCollection, StacItem } from "stac-ts";

export type StacValue =
  | StacCatalog
  | StacCollection
  | StacItem
  | StacItemCollection;

export type StacItemCollection = {
  type: "FeatureCollection";
  features: StacItem[];
  id?: string;
  [k: string]: unknown;
};
