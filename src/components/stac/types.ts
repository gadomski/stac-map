import type { StacCatalog, StacCollection, StacItem, StacLink } from "stac-ts";

export type StacValue =
  | StacCatalog
  | StacCollection
  | StacItem
  | StacItemCollection;

export type StacItemCollection = {
  type: "FeatureCollection";
  features: StacItem[];
  id?: string;
  links?: StacLink[];
  [k: string]: unknown;
};
