import { useFileUpload } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import type { StacItemCollection, StacValue } from "./types";
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
            setValue(data);
          } else {
            setError(
              `Could not GET ${href} (${
                response.status
              }): ${await response.text()}`
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
