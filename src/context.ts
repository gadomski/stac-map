import type { UseFileUploadReturn } from "@chakra-ui/react";
import type { Table } from "apache-arrow";
import { createContext, type Dispatch } from "react";
import type { StacCollection, StacItem } from "stac-ts";
import type { StacGeoparquetMetadata } from "./components/stac/stac-geoparquet";
import type { StacSearchRequest, StacValue } from "./components/stac/types";

export const StacMapContext = createContext<StacMapContextType | null>(null);

interface StacMapContextType {
  href: string | undefined;
  setHref: (href: string | undefined) => void;
  fileUpload: UseFileUploadReturn;

  value: StacValue | undefined;
  valueIsPending: boolean;

  collections: StacCollection[] | undefined;
  collectionsIsPending: boolean;
  selectedCollections: Set<string>;
  selectedCollectionsDispatch: Dispatch<SelectedCollectionsAction>;

  stacGeoparquetTable: Table | undefined;
  stacGeoparquetTableIsPending: boolean;
  stacGeoparquetMetadata: StacGeoparquetMetadata | undefined;
  stacGeoparquetMetadataIsPending: boolean;
  setStacGeoparquetItemId: (id: string) => void;
  stacGeoparquetItem: StacItem | undefined;
  stacGeoparquetItemIsPending: boolean;

  searchRequest: StacSearchRequest | undefined;
  setSearchRequest: (searchRequest: StacSearchRequest | undefined) => void;
  searchItems: StacItem[] | undefined;
  searchNumberMatched: number | undefined;
  searchHasNextPage: boolean;

  item: StacItem | undefined;
  setItem: (item: StacItem | undefined) => void;

  dateRange: {
    startDate: string | null;
    endDate: string | null;
  } | null;
  setDateRange: (range: { startDate: string | null; endDate: string | null; } | null) => void;
}

export type SelectedCollectionsAction =
  | { type: "select-collection"; id: string }
  | { type: "set-selected-collections"; collections: Set<string> }
  | { type: "deselect-collection"; id: string }
  | { type: "deselect-all-collections" };
