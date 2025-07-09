import type { StacCatalog, StacCollection, StacItem, StacLink } from "stac-ts";

export type StacValue =
  | StacCatalog
  | StacCollection
  | StacItem
  | StacItemCollection;

export interface StacItemCollection {
  type: "FeatureCollection";
  features: StacItem[];
  id?: string;
  title?: string;
  description?: string;
  links?: StacLink[];
  numberMatched?: number;
  [k: string]: unknown;
}

export interface StacCollections {
  collections: StacCollection[];
  links?: StacLink[];
}

export interface StacSearch {
  collections?: string[];
  bbox?: number[];
  limit?: number;
  datetime?: string;
}

export interface StacSearchRequest {
  search: StacSearch;
  link: StacLink;
}

export interface NaturalLanguageCollectionSearchResult {
  collection_id: string;
  explanation: string;
}
