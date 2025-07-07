import type { UseFileUploadReturn } from "@chakra-ui/react";
import type { Table } from "apache-arrow";
import { createContext, type Dispatch } from "react";
import type { StacCollection, StacItem } from "stac-ts";
import type { StacGeoparquetMetadata } from "./components/stac/stac-geoparquet";
import type { StacValue } from "./components/stac/types";

export const StacMapContext = createContext<StacMapContextType | null>(null);

interface StacMapContextType {
  href: string | undefined;
  setHref: (href: string | undefined) => void;
  fileUpload: UseFileUploadReturn;

  value: StacValue | undefined;
  valueLoading: boolean;

  collections: StacCollection[] | undefined;
  collectionsLoading: boolean;
  selectedCollections: Set<string>;
  selectedCollectionsDispatch: Dispatch<SelectedCollectionsAction>;

  stacGeoparquetTable: Table | undefined;
  stacGeoparquetTableLoading: boolean;
  stacGeoparquetMetadata: StacGeoparquetMetadata | undefined;
  stacGeoparquetMetadataLoading: boolean;
  setStacGeoparquetItemId: (id: string) => void;
  stacGeoparquetItem: StacItem | undefined;
  stacGeoparquetItemLoading: boolean;
}

export type SelectedCollectionsAction =
  | { type: "select-collection"; id: string }
  | { type: "deselect-collection"; id: string }
  | { type: "deselect-all-collections" };
