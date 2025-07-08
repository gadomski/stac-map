import type { UseFileUploadReturn } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { isParquetFile, useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import type { StacCollection, StacItem } from "stac-ts";
import { toaster } from "../ui/toaster";
import type {
  NaturalLanguageCollectionSearchResult,
  StacCollections,
  StacItemCollection,
  StacSearch,
  StacSearchRequest,
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
    enabled: !!href,
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
    enabled: !!href,
  });

  useEffect(() => {
    setCurrentHref(href);
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
      setCollections((collections) => [
        ...(collections ?? []),
        ...data.collections,
      ]);
      if (data) {
        const nextLink = data.links?.find((link) => link.rel == "next");
        if (nextLink) {
          setCurrentHref(nextLink.href);
        }
      }
    }
  }, [data]);

  return { collections, isPending, error };
}

export function useItemSearch(searchRequest: StacSearchRequest | undefined) {
  const [items, setItems] = useState<StacItem[] | undefined>();
  const [url, setUrl] = useState<URL | undefined>();
  const [body, setBody] = useState<StacSearch | undefined>();
  const [method, setMethod] = useState<string | undefined>();
  const [numberMatched, setNumberMatched] = useState<number | undefined>();

  const { data, isPending, error } = useQuery<StacItemCollection | null>({
    queryKey: ["item-search", url, method, body],
    queryFn: async () => {
      if (url && method) {
        return await fetch(url, {
          method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body && JSON.stringify(body),
        }).then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              `Error while searching ${url}: ${response.statusText}`,
            );
          }
        });
      } else {
        return null;
      }
    },
    enabled: !!searchRequest,
  });

  useEffect(() => {
    setItems(undefined);
    if (searchRequest) {
      const search = searchRequest.search;
      const url = new URL(searchRequest.link.href);
      const method = (searchRequest.link.method as string | undefined) || "GET";
      if (method === "GET") {
        if (search.collections) {
          url.searchParams.set("collections", search.collections.join(","));
        }
        setBody(undefined);
      } else {
        setBody(searchRequest.search);
      }
      setUrl(url);
      setMethod(method);
    }
  }, [searchRequest]);

  useEffect(() => {
    if (data) {
      setItems((items) => [...(items || []), ...data.features]);
      if (data.numberMatched) {
        setNumberMatched(data.numberMatched);
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while searching",
        description: error.message,
      });
    }
  }, [error]);

  return { items, isPending, numberMatched };
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
