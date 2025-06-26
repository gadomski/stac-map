import { useFileUpload } from "@chakra-ui/react";
import { Table } from "apache-arrow";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import type {
  NaturalLanguageCollectionSearchResult,
  NaturalLanguageSearchResult,
  StacItemCollection,
  StacValue,
} from "./types";
import { isUrl } from "./utils";

export function useStacValue(initialHref: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<StacValue | undefined>();
  const [href, setHref] = useState(initialHref);
  const [stacGeoparquetPath, setStacGeoparquetPath] = useState<
    string | undefined
  >();
  const fileUpload = useFileUpload();
  const { db } = useDuckDb();

  useEffect(() => {
    if (isUrl(href)) {
      setLoading(true);
      // TODO allow this to be forced, somehow
      if (href.endsWith(".parquet")) {
        setValue(getStacGeoparquetItemCollection(href));
        setStacGeoparquetPath(href);
      } else {
        setStacGeoparquetPath(undefined);
        (async () => {
          const response = await fetch(href);
          if (response.ok) {
            const data = await response.json();
            // TODO do we want to do some validation here?
            setValue(data);
          } else {
            setError(
              `Could not GET ${href} (${
                response.status
              }): ${await response.text()}`,
            );
          }
        })();
      }
      setLoading(false);
    }
  }, [href]);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length >= 1 && db) {
      setLoading(true);
      const file = fileUpload.acceptedFiles[0];
      setHref(file.name);
      (async () => {
        // TODO allow this to be forced, somehow
        if (file.name.endsWith(".parquet")) {
          const buffer = await file.arrayBuffer();
          db.registerFileBuffer(file.name, new Uint8Array(buffer));
          setValue(getStacGeoparquetItemCollection(file.name));
          setStacGeoparquetPath(file.name);
        } else {
          const text = await file.text();
          try {
            setValue(JSON.parse(text));
          } catch (error) {
            setError(`${file} is not JSON: ${error}`);
          }
        }
      })();
      setLoading(false);
    }
  }, [fileUpload.acceptedFiles, db]);

  return {
    loading,
    error,
    value,
    href,
    setHref,
    fileUpload,
    stacGeoparquetPath,
  };
}

function getStacGeoparquetItemCollection(href: string): StacItemCollection {
  return {
    type: "FeatureCollection",
    features: [],
    title: href.split("/").pop(),
    description: "A stac-geoparquet file",
  };
}

export function useDuckDbQuery({
  path,
  select,
  customFunction,
  where,
}: {
  path: string;
  select: string;
  customFunction?: string;
  where?: string;
}) {
  const { db, loading: duckDbLoading, error: duckDbError } = useDuckDb();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [table, setTable] = useState<Table | undefined>();

  // TODO what do we do about union by name issues with globs?
  const from =
    (customFunction && `${customFunction}('${path}')`) ||
    `read_parquet('${path}', union_by_name=true)`;

  useEffect(() => {
    if (db) {
      setLoading(true);
      (async () => {
        try {
          const connection = await db.connect();
          connection.query("LOAD spatial;");
          let query = `SELECT ${select} FROM ${from}`;
          if (where) {
            query += " WHERE " + where;
          }
          const table = await connection.query(query);
          // @ts-expect-error Don't know why the tables aren't recognized
          setTable(table);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setError(`DuckDB query error: ${e.toString()}`);
        }
      })();
      setLoading(false);
    }
  }, [db, setError, setLoading, setTable, select, from, where]);

  useEffect(() => {
    if (duckDbLoading) {
      setLoading(duckDbLoading);
    }
  }, [duckDbLoading, setLoading]);

  useEffect(() => {
    if (duckDbError) {
      setError(`DuckDB Error: ${duckDbError.toString()}`);
    }
  }, [duckDbError, setError]);

  return { table, loading, error };
}

export function useNaturalLanguageSearch({
  query,
  catalog,
}: {
  query: string | undefined;
  catalog: string;
}) {
  const { loading, error, results } =
    useNaturalLanguageRequest<NaturalLanguageSearchResult>({
      endpoint: "items/search",
      catalog,
      query,
    });

  return { loading, error, results };
}

export function useNaturalLanguageCollectionSearch({
  query,
  catalog,
}: {
  query: string | undefined;
  catalog: string;
}) {
  const { loading, error, results } = useNaturalLanguageRequest<
    NaturalLanguageCollectionSearchResult[]
  >({ endpoint: "search", catalog, query });

  return { loading, error, results };
}

function useNaturalLanguageRequest<T>({
  endpoint,
  query,
  catalog,
}: {
  endpoint: "search" | "items/search";
  query: string | undefined;
  catalog: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<T | undefined>();

  useEffect(() => {
    (async () => {
      if (query) {
        setResults(undefined);
        setLoading(true);
        const body = JSON.stringify({
          query,
          catalog_url: catalog,
        });
        const url = new URL(
          endpoint,
          import.meta.env.VITE_STAC_NATURAL_QUERY_API,
        );
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
        if (response.ok) {
          setResults((await response.json()).results);
        } else {
          setError(
            "Error while making a natural language query: " +
              (await response.text()),
          );
        }
        setLoading(false);
      } else {
        setResults(undefined);
      }
    })();
  }, [endpoint, query, catalog, setLoading, setError, setResults]);

  return { loading, error, results };
}
