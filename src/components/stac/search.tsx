import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Collapsible,
  createListCollection,
  DataList,
  Field,
  HStack,
  NumberInput,
  Portal,
  Select,
  Stack,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { LuSearch } from "react-icons/lu";
import type { StacCollection, StacItem, StacLink } from "stac-ts";
import { useMap } from "../map/context";
import { toaster } from "../ui/toaster";
import { InfoTip } from "../ui/toggle-tip";
import type { StacItemCollection } from "./types";
import { filterCollections } from "./utils";

export default function Search({
  collections,
  links,
  setSearch,
}: {
  collections: StacCollection[];
  links: StacLink[];
  setSearch: Dispatch<SetStateAction<StacItemCollection | undefined>>;
}) {
  const { bounds } = useMap();
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [includeGlobalCollections, setIncludeGlobalCollections] =
    useState(true);
  const [allowCollectionlessSearch, setAllowCollectionlessSearch] =
    useState(false);
  const [link, setLink] = useState<StacLink | undefined>();
  const [searchData, setSearchData] = useState<SearchData | undefined>();
  const [searchError, setSearchError] = useState<string | undefined>();
  const [limit, setLimit] = useState<number | undefined>();
  const [maxItems, setMaxItems] = useState(1000);

  useEffect(() => {
    setFilteredCollections(
      filterCollections(collections, bounds, includeGlobalCollections),
    );
  }, [collections, setFilteredCollections, bounds, includeGlobalCollections]);

  useEffect(() => {
    if (links.length > 0) {
      setLink(links[0]);
    }
  }, [links, setLink]);

  return (
    <Stack gap={8}>
      <DataList.Root gap={4}>
        <DataList.Item>
          <DataList.ItemLabel>
            Bounding box
            <InfoTip content="Defined by the map bounds"></InfoTip>
          </DataList.ItemLabel>
          <DataList.ItemValue>
            {bounds
              ?.toArray()
              .flat()
              .map((n) => Number(n.toFixed(4)))
              .join(", ")}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>
            Collections <Badge>{filteredCollections.length}</Badge>
            <InfoTip content="Filtered to viewport"></InfoTip>
          </DataList.ItemLabel>
          <DataList.ItemValue>
            <Stack w={"full"}>
              <CollectionsSelect
                selectedCollections={selectedCollections}
                setSelectedCollections={setSelectedCollections}
                collections={filteredCollections}
              ></CollectionsSelect>
              <Checkbox.Root
                size={"sm"}
                checked={includeGlobalCollections}
                onCheckedChange={(e) =>
                  setIncludeGlobalCollections(!!e.checked)
                }
              >
                <Checkbox.HiddenInput></Checkbox.HiddenInput>
                <Checkbox.Control></Checkbox.Control>
                <Checkbox.Label>Include global collections</Checkbox.Label>
              </Checkbox.Root>
            </Stack>
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Max items</DataList.ItemLabel>
          <DataList.ItemValue>
            <NumberInput.Root
              size={"sm"}
              value={maxItems.toString()}
              onValueChange={(e) => setMaxItems(e.valueAsNumber)}
            >
              <NumberInput.Control></NumberInput.Control>
              <NumberInput.Input></NumberInput.Input>
            </NumberInput.Root>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>

      <Collapsible.Root>
        <Collapsible.Trigger mb={4}>Advanced options</Collapsible.Trigger>
        <Collapsible.Content>
          <DataList.Root>
            <DataList.Item>
              <DataList.ItemLabel>Page size</DataList.ItemLabel>
              <DataList.ItemValue>
                <Field.Root>
                  <NumberInput.Root
                    size={"sm"}
                    value={limit?.toString()}
                    onValueChange={(e) => setLimit(e.valueAsNumber)}
                  >
                    <NumberInput.Control></NumberInput.Control>
                    <NumberInput.Input></NumberInput.Input>
                  </NumberInput.Root>
                  <Field.HelperText>
                    Leave blank to use the server default
                  </Field.HelperText>
                </Field.Root>
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </Collapsible.Content>
      </Collapsible.Root>
      <HStack gap={4}>
        <Button
          onClick={() => {
            if (
              selectedCollections.length === 0 &&
              !allowCollectionlessSearch
            ) {
              setSearchError(
                "Collection-less search is disabled, choose at least once collection before searching",
              );
            } else {
              setSearchError(undefined);
              setSearchData({
                collections: selectedCollections,
                bbox: bounds?.toArray().flat(),
                maxItems,
                limit,
              });
            }
          }}
          disabled={link == undefined}
        >
          <LuSearch></LuSearch>Search
        </Button>
        <Checkbox.Root
          size={"sm"}
          checked={allowCollectionlessSearch}
          onCheckedChange={(e) => setAllowCollectionlessSearch(!!e.checked)}
          variant={"subtle"}
        >
          <Checkbox.HiddenInput></Checkbox.HiddenInput>
          <Checkbox.Control></Checkbox.Control>
          <Checkbox.Label>Allow collection-less search?</Checkbox.Label>
        </Checkbox.Root>
      </HStack>

      {searchError && (
        <Alert.Root status={"error"}>
          <Alert.Indicator></Alert.Indicator>
          <Alert.Description>{searchError}</Alert.Description>
        </Alert.Root>
      )}

      {searchData && link && (
        <SearchResults
          link={link}
          setSearch={setSearch}
          {...searchData}
        ></SearchResults>
      )}
    </Stack>
  );
}

type SearchData = {
  collections: string[];
  bbox: number[] | undefined;
  maxItems: number;
  limit: number | undefined;
};

function CollectionsSelect({
  collections,
  selectedCollections,
  setSelectedCollections,
}: {
  collections: StacCollection[];
  selectedCollections: string[];
  setSelectedCollections: Dispatch<SetStateAction<string[]>>;
}) {
  const collection = createListCollection({
    items: collections,
    itemToString: (collection) => collection.title || collection.id,
    itemToValue: (collection) => collection.id,
  });

  function onSelect(e: MenuSelectionDetails) {
    if (selectedCollections.includes(e.value)) {
      setSelectedCollections(selectedCollections.filter((s) => s != e.value));
    } else {
      setSelectedCollections([...selectedCollections, e.value]);
    }
  }

  return (
    <Select.Root
      multiple
      collection={collection}
      onSelect={onSelect}
      value={selectedCollections}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select collection(s)" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((collection) => (
              <Select.Item item={collection} key={collection.id}>
                {collection.title || collection.id}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

function SearchResults({
  collections,
  bbox,
  maxItems,
  limit,
  link,
  setSearch,
}: {
  collections: string[];
  bbox: number[] | undefined;
  maxItems: number;
  limit: number | undefined;
  link: StacLink;
  setSearch: Dispatch<SetStateAction<StacItemCollection | undefined>>;
}) {
  const { items, error, loading, cancel } = useStacSearch({
    collections,
    bbox,
    maxItems,
    limit,
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
      setSearch({
        type: "FeatureCollection",
        features: items,
        id: "search-results",
        title: "Search results",
      });
    }
  }, [items, setSearch]);

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
  collections,
  bbox,
  maxItems,
  limit,
  link,
}: {
  collections: string[];
  bbox: number[] | undefined;
  maxItems: number;
  limit: number | undefined;
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
      if (link.type == "POST") {
        throw new Error("POST is not yet implemented");
        // TODO
      } else {
        let url = new URL(link.href);
        url.searchParams.set("collections", collections.join(","));
        if (bbox) {
          url.searchParams.set("bbox", bbox.join(","));
        }
        if (limit) {
          url.searchParams.set("limit", limit.toString());
        }
        while (true) {
          if (cancel.current) {
            break;
          }
          const response = await fetch(url);
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
              const newUrl = new URL(nextLink.href);
              if (newUrl == url) {
                setError(
                  `'next' link had the same url as the current page: ${newUrl}`,
                );
                break;
              } else {
                url = new URL(nextLink.href);
              }
            } else {
              break;
            }
          } else {
            setError(`Error while fetching ${url}: ${await response.text()}`);
            break;
          }
        }
      }
      cancel.current = false;
      setLoading(false);
    })();
  }, [bbox, collections, link.href, link.type, maxItems, limit]);

  return { loading, error, items, cancel };
}
