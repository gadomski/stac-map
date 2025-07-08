import type { UseFileUploadReturn } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { isParquetFile, useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import type { StacCollection } from "stac-ts";
import { toaster } from "../ui/toaster";
import type {
  NaturalLanguageCollectionSearchResult,
  StacCollections,
  StacItemCollection,
  StacValue,
} from "./types";

export function useStacValue(
  href: string | undefined,
  fileUpload: UseFileUploadReturn,
) {
  const [value, setValue] = useState<StacValue | undefined>();
  const [parquetPath, setParquetPath] = useState<string | undefined>();
  const { db } = useDuckDb();
  const { data, isPending, error } = useQuery<{
    value: StacValue;
    parquetPath: string | undefined;
  } | null>({
    queryKey: ["stac-value", href, fileUpload.acceptedFiles],
    queryFn: async () => {
      if (href) {
        if (isUrl(href)) {
          // TODO allow this to be forced
          if (href.endsWith(".parquet")) {
            return {
              value: getStacGeoparquetValue(href),
              parquetPath: href,
            };
          } else {
            const data = await fetch(href).then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error(
                  `Error while fetching the STAC value at ${href}: ${response.statusText}`,
                );
              }
            });
            return {
              value: data,
              parquetPath: undefined,
            };
          }
        } else if (fileUpload.acceptedFiles.length == 1) {
          const file = fileUpload.acceptedFiles[0];
          if (await isParquetFile(file)) {
            if (db) {
              db.registerFileBuffer(
                href,
                new Uint8Array(await file.arrayBuffer()),
              );
              return {
                value: getStacGeoparquetValue(href),
                parquetPath: href,
              };
            } else {
              throw new Error(
                `Could not load ${href}, the DuckDB database is not initialized`,
              );
            }
          } else {
            return {
              value: JSON.parse(await file.text()),
              parquetPath: undefined,
            };
          }
        } else {
          throw new Error(
            `Href '${href}' is not a URL, but there is not one (and only one) uploaded, accepted file`,
          );
        }
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    setValue(undefined);
  }, [href]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while fetching the STAC value",
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setValue(data.value);
      setParquetPath(data.parquetPath);
    } else {
      setValue(undefined);
      setParquetPath(undefined);
    }
  }, [data]);

  return { value, parquetPath, isPending };
}

export function useStacCollections(href: string | undefined) {
  const [currentHref, setCurrentHref] = useState<string | undefined>();
  const [pages, setPages] = useState<StacCollections[]>([]);
  const [collections, setCollections] = useState<
    StacCollection[] | undefined
  >();
  const { data, isPending, error } = useQuery<StacCollections | null>({
    queryKey: ["stac-collections", currentHref],
    queryFn: async () => {
      if (currentHref) {
        return await fetch(currentHref).then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              `Error while fetching collections at ${currentHref}: ${response.statusText}`,
            );
          }
        });
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    setCurrentHref(href);
    setPages([]);
    setCollections(undefined);
  }, [href]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while fetching STAC collections",
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setPages((pages) => [...pages, data]);
      if (data) {
        const nextLink = data.links?.find((link) => link.rel == "next");
        if (nextLink) {
          setCurrentHref(nextLink.href);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (pages.length > 0) {
      setCollections(pages.flatMap((page) => page.collections));
    } else {
      setCollections(undefined);
    }
  }, [pages]);

  return { collections, isPending, error };
}

export function useNaturalLanguageCollectionSearch(
  query: string,
  href: string,
) {
  const [results, setResults] = useState<
    NaturalLanguageCollectionSearchResult[] | undefined
  >();
  const { data, isPending, error } = useQuery({
    queryKey: ["natural-language-collection-search", query, href],
    queryFn: async () => {
      const body = JSON.stringify({
        query,
        catalog_url: href,
      });
      const url = new URL(
        "search",
        import.meta.env.VITE_STAC_NATURAL_QUERY_API,
      );
      return await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Error while performing natural language collection search on ${href}: ${response.statusText}`,
          );
        }
      });
    },
  });

  useEffect(() => {
    if (data) {
      setResults(data.results);
    } else {
      setResults(undefined);
    }
  }, [data]);

  return { results, isPending, error };
}

function getStacGeoparquetValue(href: string): StacItemCollection {
  return {
    type: "FeatureCollection",
    features: [],
    title: href.split("/").pop(),
    description: "A stac-geoparquet file",
  };
}

function isUrl(href: string) {
  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
}
