import { useFileUpload } from "@chakra-ui/react";
import { useEffect, useReducer, useState, type ReactNode } from "react";
import type { StacItem } from "stac-ts";
import { SelectedCollectionsActionBar } from "./components/stac/collection";
import {
  useItemSearch,
  useStacCollections,
  useStacValue,
} from "./components/stac/hooks";
import {
  useStacGeoparquetItem,
  useStacGeoparquetMetadata,
  useStacGeoparquetTable,
} from "./components/stac/stac-geoparquet";
import type { StacSearchRequest } from "./components/stac/types";
import { StacMapContext, type SelectedCollectionsAction } from "./context";
import { useDuckDbConnection } from "./hooks";

export function StacMapProvider({ children }: { children: ReactNode }) {
  const { connection } = useDuckDbConnection();
  const [href, setHref] = useState<string | undefined>(getInitialHref());
  const fileUpload = useFileUpload({ maxFiles: 1 });
  const {
    value,
    isPending: valueIsPending,
    parquetPath,
  } = useStacValue(href, fileUpload);
  const { collections, isPending: collectionsIsPending } = useStacCollections(
    value?.links?.find((link) => link.rel == "data")?.href,
  );
  const [selectedCollections, selectedCollectionsDispatch] = useReducer(
    selectedCollectionsReducer,
    new Set<string>(),
  );
  const {
    table: stacGeoparquetTable,
    isPending: stacGeoparquetTableIsPending,
  } = useStacGeoparquetTable(parquetPath, connection);
  const {
    metadata: stacGeoparquetMetadata,
    isPending: stacGeoparquetMetadataIsPending,
  } = useStacGeoparquetMetadata(parquetPath, connection);
  const [stacGeoparquetItemId, setStacGeoparquetItemId] = useState<
    string | undefined
  >();
  const { item: stacGeoparquetItem, isPending: stacGeoparquetItemIsPending } =
    useStacGeoparquetItem(stacGeoparquetItemId, parquetPath, connection);
  const [searchRequest, setSearchRequest] = useState<
    StacSearchRequest | undefined
  >();
  const {
    items: searchItems,
    hasNextPage: searchHasNextPage,
    numberMatched: searchNumberMatched,
  } = useItemSearch(searchRequest);
  const [item, setItem] = useState<StacItem | undefined>();

  useEffect(() => {
    function handlePopState() {
      setHref(new URLSearchParams(location.search).get("href") ?? "");
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    selectedCollectionsDispatch({ type: "deselect-all-collections" });
    if (href) {
      if (new URLSearchParams(location.search).get("href") != href) {
        history.pushState(null, "", "?href=" + href);
      }
    }
  }, [href]);

  useEffect(() => {
    // It should never be more than 1.
    if (fileUpload.acceptedFiles.length == 1) {
      setHref(fileUpload.acceptedFiles[0].name);
    }
  }, [fileUpload.acceptedFiles]);

  useEffect(() => {
    setItem(undefined);
  }, [searchRequest]);

  const contextValue = {
    href,
    setHref,
    fileUpload,

    value,
    valueIsPending,

    collections,
    collectionsIsPending,
    selectedCollections,
    selectedCollectionsDispatch,

    stacGeoparquetTable,
    stacGeoparquetMetadata,
    stacGeoparquetTableIsPending,
    stacGeoparquetMetadataIsPending,
    setStacGeoparquetItemId,
    stacGeoparquetItem,
    stacGeoparquetItemIsPending,

    searchRequest,
    setSearchRequest,
    searchItems,
    searchNumberMatched,
    searchHasNextPage,

    item,
    setItem,
  };

  return (
    <StacMapContext.Provider value={contextValue}>
      {children}
      {collections && (
        <SelectedCollectionsActionBar
          collections={collections.filter((collection) =>
            selectedCollections.has(collection.id),
          )}
          dispatch={selectedCollectionsDispatch}
        ></SelectedCollectionsActionBar>
      )}
    </StacMapContext.Provider>
  );
}

function getInitialHref() {
  const href = new URLSearchParams(location.search).get("href") || "";
  try {
    new URL(href);
  } catch {
    return undefined;
  }
  return href;
}

function selectedCollectionsReducer(
  state: Set<string>,
  action: SelectedCollectionsAction,
): Set<string> {
  switch (action.type) {
    case "select-collection":
      return new Set([...state, action.id]);
    case "set-selected-collections":
      return action.collections;
    case "deselect-collection":
      state.delete(action.id);
      return new Set([...state]);
    case "deselect-all-collections":
      return new Set();
  }
}
