import { useEffect, useState } from "react";
import type { StacCollection, StacLink } from "stac-ts";
import type { StacValue } from "./types";

export function useStacValue(href: string) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<StacValue | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setError(undefined);
      setValue(undefined);
      setLoading(true);
      try {
        const url = new URL(href);
        const response = await fetch(url);
        setValue(await response.json());
        // eslint-disable-next-line
      } catch (error: any) {
        setError(href + ": " + error.toString());
      }
      setLoading(false);
    })();
  }, [href, setValue]);

  return { value, loading, error };
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
