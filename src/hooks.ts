import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { useDuckDb } from "duckdb-wasm-kit";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { type MapRef, useMap } from "react-map-gl/maplibre";
import { sanitizeBbox } from "./components/stac/utils";
import { StacMapContext } from "./context";
import { getPadding } from "./utils";

export function useStacMap() {
  const context = useContext(StacMapContext);
  if (context) {
    return context;
  } else {
    throw new Error("useStacMap must be used from within a StacMapProvider");
  }
}

export function useFitBbox() {
  const { map } = useMap();
  const mapRef = useRef<MapRef>(null);

  const callback = useCallback((bbox: number[]) => {
    if (mapRef.current) {
      const sanitizedBbox = sanitizeBbox(bbox);
      mapRef.current.fitBounds(sanitizedBbox, { padding: getPadding() });
    }
  }, []);

  useEffect(() => {
    if (map) {
      mapRef.current = map;
    }
  }, [map]);

  return callback;
}

export function useIsCollectionSelected(id: string) {
  const { selectedCollections } = useStacMap();
  return selectedCollections.has(id);
}

export function useSelectedCollections() {
  const { collections, selectedCollections } = useStacMap();
  return collections?.filter((collection) =>
    selectedCollections.has(collection.id),
  );
}

export function useDuckDbConnection() {
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
