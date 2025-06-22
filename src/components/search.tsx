import {
  Button,
  createListCollection,
  DataList,
  NumberInput,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import type {
  StacItemCollection,
  StacSearch,
  StacSearchEndpoint,
} from "./stac/context";
import { useStac } from "./stac/hooks";
import { InfoTip } from "./ui/toggle-tip";

const DEFAULT_BBOX = [-180, -90, 180, 90];
const DEFAULT_MAX_ITEMS = 1000;

async function doSearch({
  searchEndpoint,
  search,
}: {
  searchEndpoint: StacSearchEndpoint;
  search: StacSearch;
}) {
  let body = {
    bbox: search.bbox,
    collections: search.collections,
  };
  let items: StacItem[] = [];
  while (true) {
    console.log(body);
    const response = await fetch(searchEndpoint.href, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data: StacItemCollection = await response.json();
      if (data.features) {
        items = items.concat(data.features);
      }
      const nextLink = data.links?.find((link) => link.rel == "next");
      if (nextLink) {
        // @ts-expect-error Don't want to bother typing this
        body = nextLink.body;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return items;
}

export default function Search({
  searchEndpoint,
}: {
  searchEndpoint: StacSearchEndpoint;
}) {
  const { bounds } = useStac();
  const [bbox, setBbox] = useState(bounds?.toArray().flat() || DEFAULT_BBOX);
  const [collections, setCollections] = useState<string[]>([]);
  const [maxItems, setMaxItems] = useState(DEFAULT_MAX_ITEMS);

  const collectionsForSelect = createListCollection({
    items: searchEndpoint.collections,
    itemToString: (collection) => collection.title || collection.id,
    itemToValue: (collection) => collection.id,
  });

  useEffect(() => {
    if (bounds) {
      setBbox(bounds.toArray().flat());
    }
  }, [bounds]);

  async function onSearch() {
    const search = { bbox, maxItems, collections };
    const items = await doSearch({ searchEndpoint, search });
    console.log(items);
  }

  return (
    <Stack>
      <DataList.Root orientation={"horizontal"}>
        <DataList.Item>
          <DataList.ItemLabel>
            Bounding box
            <InfoTip>
              The search bounding box is synchronized the current map bounds
            </InfoTip>
          </DataList.ItemLabel>
          <DataList.ItemValue>
            {bbox.map((n) => n.toFixed(4)).join(", ")}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Collection</DataList.ItemLabel>
          <DataList.ItemValue>
            <Select.Root
              collection={collectionsForSelect}
              value={collections}
              onValueChange={(e) => setCollections(e.value)}
            >
              <Select.HiddenSelect />

              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select collection" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>

              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {collectionsForSelect.items.map((collection) => (
                      <Select.Item item={collection} key={collection.id}>
                        {collection.title || collection.id}
                        <Select.ItemIndicator></Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Max items</DataList.ItemLabel>
          <DataList.ItemValue>
            <NumberInput.Root
              value={maxItems.toString()}
              onValueChange={(e) => setMaxItems(e.valueAsNumber)}
            >
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
              <NumberInput.Input />
            </NumberInput.Root>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
      <Button
        colorPalette={"blue"}
        variant={"solid"}
        alignSelf={"end"}
        my={2}
        onClick={onSearch}
      >
        Search <LuSearch></LuSearch>
      </Button>
    </Stack>
  );
}
