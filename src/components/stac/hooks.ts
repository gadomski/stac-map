import type { UseFileUploadReturn } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import type { StacCollection, StacLink } from "stac-ts";
import { useAppStateDispatch } from "../hooks";
import { getStacLayers } from "./layers";
import { getGeometryTable } from "./stac-geoparquet";
import type {
  NaturalLanguageCollectionSearchResult,
  StacItemCollection,
  StacValue,
} from "./types";

export function useStacValue(href: string, fileUpload: UseFileUploadReturn) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<StacValue | undefined>();
  const [parquetPath, setParquetPath] = useState<string | undefined>();
  const { db } = useDuckDb();

  useEffect(() => {
    let url;
    try {
      url = new URL(href);
    } catch {
      return;
    }

    (async () => {
      setError(undefined);
      setValue(undefined);
      setLoading(true);

      try {
        const response = await fetch(url);
        if (href.endsWith(".parquet")) {
          setParquetPath(href);
          setValue(getStacGeoparquetValue(href));
        } else {
          setParquetPath(undefined);
          setValue(await response.json());
        }
        // eslint-disable-next-line
      } catch (error: any) {
        setError(href + ": " + error.toString());
      }

      setLoading(false);
    })();
  }, [href]);

  useEffect(() => {
    try {
      // Only continue if it's a local path (from an uploaded file).
      new URL(href);
      return;
    } catch {
      // pass
    }

    (async () => {
      setError(undefined);
      setLoading(true);

      if (fileUpload.acceptedFiles.length == 1 && db) {
        const file = fileUpload.acceptedFiles[0];
        try {
          if (href.endsWith(".parquet")) {
            setParquetPath(href);
            setValue(getStacGeoparquetValue(href));
            db.registerFileBuffer(
              href,
              new Uint8Array(await file.arrayBuffer()),
            );
          } else {
            setParquetPath(undefined);
            const value = JSON.parse(await file.text());
            if (!value.id) {
              value.id = href;
            }
            setValue(value);
          }
          // eslint-disable-next-line
        } catch (error: any) {
          setError(error.toString());
        }
      }

      setLoading(false);
    })();
  }, [href, fileUpload.acceptedFiles, db]);

  return { value, parquetPath, loading, error };
}

export function useStacCollections(value: StacValue) {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<
    StacCollection[] | undefined
  >();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setCollections([]);
      setError(undefined);
      const link = value.links?.find((link) => link.rel == "data");
      if (link) {
        try {
          let url = new URL(link.href);
          let collections: StacCollection[] = [];
          while (true) {
            // TODO better error handling
            const response = await fetch(url);
            const data: { collections: StacCollection[]; links: StacLink[] } =
              await response.json();
            collections = [...collections, ...data.collections];
            setCollections(collections);
            const nextLink = data.links.find((link) => link.rel == "next");
            if (nextLink) {
              url = new URL(nextLink.href);
            } else {
              break;
            }
          }
          // eslint-disable-next-line
        } catch (error: any) {
          setError(error.toString());
        }
      } else {
        setCollections(undefined);
      }
      setLoading(false);
    })();
  }, [value, setCollections]);

  return { collections, loading, error };
}

export function useNaturalLanguageCollectionSearch(
  query: string,
  href: string,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<
    NaturalLanguageCollectionSearchResult[] | undefined
  >();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setResults(undefined);
      setError(undefined);
      const body = JSON.stringify({
        query,
        catalog_url: href,
      });
      try {
        const url = new URL(
          "search",
          import.meta.env.VITE_STAC_NATURAL_QUERY_API,
        );
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
        const data = await response.json();
        setResults(data.results);
        // eslint-disable-next-line
      } catch (error: any) {
        setError(error.toString());
      }
      setLoading(false);
    })();
  }, [query, href, setLoading, setError, setResults]);

  return { results, loading, error };
}

function getStacGeoparquetValue(href: string): StacItemCollection {
  return {
    type: "FeatureCollection",
    features: [],
    title: href.split("/").pop(),
    description: "A stac-geoparquet file",
  };
}

export function useStacLayers(
  value: StacValue,
  collections: StacCollection[] | undefined,
  parquetPath: string | undefined,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [layers, setLayers] = useState<Layer[]>();
  const { db } = useDuckDb();
  const dispatch = useAppStateDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (parquetPath) {
        if (db) {
          try {
            const table = await getGeometryTable(parquetPath, db);
            const layer = new GeoArrowPolygonLayer({
              id: "geoarrow-polygons",
              data: table,
              stroked: true,
              filled: true,
              pickable: true,
              onClick: (info) => {
                const id = table.getChild("id")?.get(info.index);
                if (typeof id === "string") {
                  dispatch({ type: "pick-id", id });
                }
              },
              getFillColor: [207, 63, 2, 25],
              getLineColor: [207, 63, 2, 50],
              lineWidthUnits: "pixels",
              autoHighlight: true,
            });
            setLayers([layer]);
            // eslint-disable-next-line
          } catch (error: any) {
            setError(error.toString());
          }
        } else {
          setLayers([]);
        }
      } else {
        setLayers(getStacLayers(value, collections, dispatch));
      }
      setLoading(false);
    })();
  }, [value, collections, parquetPath, db, dispatch]);

  return { layers, loading, error };
}

export function useStacLayersMultiple(values: StacValue[]) {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    setLayers(
      values.flatMap((value) => getStacLayers(value, undefined, undefined)),
    );
  }, [values]);

  return { layers };
}
