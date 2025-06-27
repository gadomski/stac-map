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
  title?: string;
  description?: string;
  links?: StacLink[];
  [k: string]: unknown;
};

export type StacSearch = {
  collections?: string[];
  bbox?: number[];
  limit?: number;
};

export type NaturalLanguageCollectionSearchResult = {
  collection_id: string;
  explanation: string;
};
