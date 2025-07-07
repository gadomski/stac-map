import {
  ActionBar,
  Button,
  IconButton,
  Portal,
  useFileUpload,
} from "@chakra-ui/react";
import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { useDuckDb } from "duckdb-wasm-kit";
import {
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { LuFocus, LuX } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { useStacCollections, useStacValue } from "./components/stac/hooks";
import {
  useStacGeoparquetItem,
  useStacGeoparquetMetadata,
  useStacGeoparquetTable,
} from "./components/stac/stac-geoparquet";
import { getCollectionsExtent } from "./components/stac/utils";
import { toaster } from "./components/ui/toaster";
import { StacMapContext, type SelectedCollectionsAction } from "./context";
import { useFitBbox } from "./hooks";

export function StacMapProvider({ children }: { children: ReactNode }) {
  const [href, setHref] = useState<string | undefined>(getInitialHref());
  const fileUpload = useFileUpload({ maxFiles: 1 });
  const {
    value,
    loading: valueLoading,
    parquetPath,
    error: valueError,
  } = useStacValue(href, fileUpload);
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useStacCollections(value);
  const [selectedCollections, selectedCollectionsDispatch] = useReducer(
    selectedCollectionsReducer,
    new Set<string>(),
  );
  const { connection, error: duckDbConnectionError } = useDuckDbConnection();
  const {
    table: stacGeoparquetTable,
    loading: stacGeoparquetTableLoading,
    error: stacGeoparquetTableError,
  } = useStacGeoparquetTable(parquetPath, connection);
  const {
    metadata: stacGeoparquetMetadata,
    loading: stacGeoparquetMetadataLoading,
    error: stacGeoparquetMetadataError,
  } = useStacGeoparquetMetadata(parquetPath, connection);
  const [stacGeoparquetItemId, setStacGeoparquetItemId] = useState<
    string | undefined
  >();
  const {
    item: stacGeoparquetItem,
    loading: stacGeoparquetItemLoading,
    error: stacGeoparquetItemError,
  } = useStacGeoparquetItem(stacGeoparquetItemId, parquetPath, connection);

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
    if (valueError) {
      createToastError("Error when getting a STAC value", valueError);
    }
  }, [valueError]);

  useEffect(() => {
    if (collectionsError) {
      createToastError("Error when getting STAC collections", collectionsError);
    }
  }, [collectionsError]);

  useEffect(() => {
    if (duckDbConnectionError) {
      createToastError(
        "Error loading DuckDB",
        duckDbConnectionError.toString(),
      );
    }
  }, [duckDbConnectionError]);

  useEffect(() => {
    if (stacGeoparquetTableError) {
      createToastError(
        "Error reading stac-geoparquet",
        stacGeoparquetTableError,
      );
    }
  }, [stacGeoparquetTableError]);

  useEffect(() => {
    if (stacGeoparquetMetadataError) {
      createToastError(
        "Error reading stac-geoparquet metadata",
        stacGeoparquetMetadataError,
      );
    }
  }, [stacGeoparquetMetadataError]);

  useEffect(() => {
    if (stacGeoparquetItemError) {
      createToastError(
        "Error getting stac-geoparquet item",
        stacGeoparquetItemError,
      );
    }
  }, [stacGeoparquetItemError]);

  const contextValue = {
    href,
    setHref,
    fileUpload,

    value,
    valueLoading,

    collections,
    collectionsLoading,
    selectedCollections,
    selectedCollectionsDispatch,

    stacGeoparquetTable,
    stacGeoparquetMetadata,
    stacGeoparquetTableLoading,
    stacGeoparquetMetadataLoading,
    setStacGeoparquetItemId,
    stacGeoparquetItem,
    stacGeoparquetItemLoading,
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

function createToastError(title: string, description: string) {
  toaster.create({ type: "error", title, description });
}

function useDuckDbConnection() {
  const { db, error } = useDuckDb();
  const [connection, setConnection] = useState<
    AsyncDuckDBConnection | undefined
  >();

  useEffect(() => {
    (async () => {
      if (db) {
        const connection = await db.connect();
        await connection.query("LOAD spatial;");
        setConnection(connection);
      } else {
        setConnection(undefined);
      }
    })();
  }, [db]);

  return { connection, error };
}

function SelectedCollectionsActionBar({
  collections,
  dispatch,
}: {
  collections: StacCollection[];
  dispatch: Dispatch<SelectedCollectionsAction>;
}) {
  const fitBbox = useFitBbox();

  return (
    <ActionBar.Root open={collections.length > 0}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {collections.length} collection{collections.length > 1 && "s"}{" "}
              selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator></ActionBar.Separator>
            <IconButton
              variant={"outline"}
              size={"xs"}
              onClick={() => fitBbox(getCollectionsExtent(collections))}
            >
              <LuFocus></LuFocus>
            </IconButton>
            <Button
              size={"xs"}
              variant={"outline"}
              onClick={() => dispatch({ type: "deselect-all-collections" })}
            >
              <LuX></LuX> Deselect all
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}

function selectedCollectionsReducer(
  state: Set<string>,
  action: SelectedCollectionsAction,
): Set<string> {
  switch (action.type) {
    case "select-collection":
      return new Set([...state, action.id]);
    case "deselect-collection":
      state.delete(action.id);
      return new Set([...state]);
    case "deselect-all-collections":
      return new Set();
  }
}
