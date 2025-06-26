import { Button, HStack, Stack } from "@chakra-ui/react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { StacCollection, StacItem, StacLink } from "stac-ts";
import { toaster } from "../ui/toaster";
import SearchDialog from "./search-dialog";
import type { StacItemCollection, StacSearch } from "./types";

export default function Search({
  collections,
  links,
  setItemCollection,
  catalogHref,
}: {
  collections: StacCollection[];
  links: StacLink[];
  setItemCollection: Dispatch<SetStateAction<StacItemCollection | undefined>>;
  catalogHref: string | undefined;
}) {
  const [link, setLink] = useState<StacLink | undefined>();
  const [search, setSearch] = useState<StacSearch | undefined>();
  const [maxItems, setMaxItems] = useState(1000);

  useEffect(() => {
    if (links.length > 0) {
      setLink(links[0]);
    }
  }, [links, setLink]);

  return (
    <Stack gap={8}>
      <SearchDialog
        collections={collections}
        link={link}
        links={links}
        setLink={setLink}
        maxItems={maxItems}
        setMaxItems={setMaxItems}
        setSearch={setSearch}
        catalogHref={catalogHref}
      ></SearchDialog>

      {search && link && (
        <SearchResults
          search={search}
          maxItems={maxItems}
          link={link}
          setItemCollection={setItemCollection}
        ></SearchResults>
      )}
    </Stack>
  );
}

function SearchResults({
  search,
  maxItems,
  link,
  setItemCollection,
}: {
  search: StacSearch;
  maxItems: number;
  link: StacLink;
  setItemCollection: Dispatch<SetStateAction<StacItemCollection | undefined>>;
}) {
  const { items, error, loading, cancel } = useStacSearch({
    search,
    maxItems,
    link,
  });

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "STAC search error",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (items && items.length > 0) {
      setItemCollection({
        type: "FeatureCollection",
        features: items,
        id: "search-results",
        title: "Search results",
      });
    }
  }, [items, setItemCollection]);

  return (
    <Stack>
      {loading && (
        <HStack>
          <Button colorPalette={"red"} onClick={() => (cancel.current = true)}>
            Abort
          </Button>
        </HStack>
      )}
    </Stack>
  );
}

function useStacSearch({
  search,
  maxItems,
  link,
}: {
  search: StacSearch;
  maxItems: number;
  link: StacLink;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [items, setItems] = useState<StacItem[] | undefined>([]);
  const cancel = useRef(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let items: StacItem[] = [];
      let url = new URL(link.href);
      let method;
      let body;
      if (link.method === "POST") {
        method = "POST";
        body = JSON.stringify(search);
      } else {
        method = "GET";
        if (search.collections) {
          url.searchParams.set("collections", search.collections.join(","));
        }
        if (search.bbox) {
          url.searchParams.set("bbox", search.bbox.join(","));
        }
        if (search.limit) {
          url.searchParams.set("limit", search.limit.toString());
        }
      }

      while (true) {
        if (cancel.current) {
          break;
        }
        const response = await fetch(url, {
          method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body,
        });
        if (response.ok) {
          const data: StacItemCollection = await response.json();
          // TODO more robust error handling
          if (data.features) {
            items = [...items, ...data.features];
            setItems(items);
            if (items.length >= maxItems) {
              break;
            }
          }
          const nextLink = data.links?.find((link) => link.rel == "next");
          if (nextLink) {
            url = new URL(nextLink.href);
            if (nextLink.body) {
              body = JSON.stringify(nextLink.body);
            }
          } else {
            break;
          }
        } else {
          setError(`Error while fetching ${url}: ${await response.text()}`);
          break;
        }
      }
      cancel.current = false;
      setLoading(false);
    })();
  }, [search, link, maxItems]);

  return { loading, error, items, cancel };
}
