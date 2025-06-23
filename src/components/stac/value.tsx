import { SkeletonText, Text, type UseFileUploadReturn } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Catalog } from "./catalog";
import { Collection } from "./collection";
import { Item } from "./item";
import { ItemCollection } from "./item-collection";
import { isUrl } from "./utils";

export default function Value({
  href,
  setHref,
  fileUpload,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
  fileUpload: UseFileUploadReturn;
}) {
  const { value, isStacGeoparquet, loading, error } = useStacValue(
    href,
    fileUpload.acceptedFiles[0]
  );
  if (loading) {
    return <SkeletonText></SkeletonText>;
  } else if (error) {
    return <Text color={"red"}>Error: {error}</Text>;
  } else if (value) {
    switch (value.type) {
      case "Catalog":
        return <Catalog catalog={value} setHref={setHref}></Catalog>;
      case "Collection":
        return <Collection collection={value}></Collection>;
      case "Feature":
        return <Item item={value}></Item>;
      case "FeatureCollection":
        return (
          <ItemCollection
            itemCollection={value}
            stacGeoparquetPath={(isStacGeoparquet && href) || undefined}
          ></ItemCollection>
        );
      default:
        <Text color={"red"}>
          Could not parse STAC value with type={value.type}
        </Text>;
    }
  }
}

function useStacValue(
  href: string,
  file?: File
): {
  value?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isStacGeoparquet: boolean;
  loading: boolean;
  error?: string;
} {
  const [loading, setLoading] = useState(false);
  const [isStacGeoparquet, setIsStacGeoparquet] = useState(false);
  const [value, setValue] = useState<any | undefined>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | undefined>();
  const { db } = useDuckDb();

  useEffect(() => {
    if (href.length > 0) {
      setLoading(true);
      if (!isUrl(href)) {
        (async () => {
          if (file) {
            if (href.endsWith(".parquet")) {
              if (db) {
                const buffer = await file.arrayBuffer();
                db.registerFileBuffer(file.name, new Uint8Array(buffer));
                setValue({
                  type: "FeatureCollection",
                  id: "stac-geoparquet",
                  title: href,
                  description: "A stac-geoparquet file",
                  features: [],
                });
                setIsStacGeoparquet(true);
                setLoading(false);
              }
            } else {
              const text = await file.text();
              setValue(JSON.parse(text));
              setLoading(false);
            }
          }
        })();
      } else if (href.endsWith(".parquet")) {
        setValue({
          type: "FeatureCollection",
          id: "stac-geoparquet",
          title: href.split("/").pop(),
          description: "A stac-geoparquet file",
          features: [],
        });
        setIsStacGeoparquet(true);
        setLoading(false);
      } else {
        (async () => {
          const response = await fetch(href);
          if (response.ok) {
            const data = await response.json();
            setValue(data);
            setLoading(false);
          } else {
            setLoading(false);
            setError(
              `Could not GET ${href} (${
                response.status
              }): ${await response.text()}`
            );
          }
        })();
      }
    }
  }, [href, setIsStacGeoparquet, file, db]);

  return { value, isStacGeoparquet, loading, error };
}
