import {
  Badge,
  Button,
  Checkbox,
  Collapsible,
  createListCollection,
  DataList,
  Field,
  Group,
  HStack,
  Input,
  NumberInput,
  Portal,
  Select,
  Stack,
  Text,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuSearch } from "react-icons/lu";
import type { StacCollection, StacLink } from "stac-ts";
import { useMap } from "../map/context";
import { toaster } from "../ui/toaster";
import { InfoTip } from "../ui/toggle-tip";
import { useNaturalLanguageCollectionSearch } from "./hooks";
import type {
  NaturalLanguageCollectionSearchResult,
  StacSearch,
} from "./types";
import { filterCollections } from "./utils";

export default function SearchDialog({
  collections,
  link,
  links,
  setLink,
  maxItems,
  setMaxItems,
  setSearch,
  catalogHref,
}: {
  collections: StacCollection[];
  link: StacLink | undefined;
  links: StacLink[];
  setLink: Dispatch<SetStateAction<StacLink | undefined>>;
  maxItems: number;
  setMaxItems: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<StacSearch | undefined>>;
  catalogHref: string | undefined;
}) {
  const { bounds } = useMap();
  const [limit, setLimit] = useState<number | undefined>();
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [allowCollectionlessSearch, setAllowCollectionlessSearch] =
    useState(false);

  useEffect(() => {
    setFilteredCollections(filterCollections(collections, bounds, true));
  }, [collections, setFilteredCollections, bounds]);

  return (
    <Stack gap={4}>
      <DataList.Root gap={6} orientation={"vertical"} variant={"bold"}>
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
              {catalogHref && (
                <NaturalLanguageCollectionSearch
                  catalogHref={catalogHref}
                  setSelectedCollections={setSelectedCollections}
                ></NaturalLanguageCollectionSearch>
              )}
            </Stack>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>

      <Collapsible.Root>
        <Collapsible.Trigger mb={4}>
          <Text fontSize={"sm"}>Advanced options</Text>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <DataList.Root orientation={"horizontal"} size={"sm"}>
            {links.length > 1 && (
              <DataList.Item>
                <DataList.ItemLabel>Method</DataList.ItemLabel>
                <DataList.ItemValue>
                  <LinkSelect
                    links={links}
                    link={link}
                    setLink={setLink}
                  ></LinkSelect>
                </DataList.ItemValue>
              </DataList.Item>
            )}
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
              toaster.create({
                type: "error",
                title: "Collection-less search is disallowed",
                description:
                  "By default, searching requires at least one collection",
              });
            } else {
              setSearch({
                collections: selectedCollections,
                bbox: bounds?.toArray().flat(),
                limit,
              });
              setMaxItems(maxItems);
            }
          }}
          disabled={link === undefined}
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
    </Stack>
  );
}

function NaturalLanguageCollectionSearch({
  setSelectedCollections,
  catalogHref,
}: {
  setSelectedCollections: Dispatch<SetStateAction<string[]>>;
  catalogHref: string;
}) {
  const [query, setQuery] = useState<string | undefined>();
  const [inputText, setInputText] = useState("");
  const { results, loading, error } = useNaturalLanguageCollectionSearch({
    query,
    catalog: catalogHref,
  });

  useEffect(() => {
    if (results.length > 0) {
      setSelectedCollections(results.map((result) => result.collection_id));
    }
  }, [results, setSelectedCollections]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error when performing natural language collection search",
        description: error,
      });
    }
  }, [error]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (inputText.length > 0) {
          setQuery(inputText);
        }
      }}
    >
      <Field.Root>
        <Group attached w="full">
          <Input
            flex="1"
            placeholder="Find collections with..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            size={"sm"}
            fontSize={"xs"}
            disabled={loading}
          />
          <Button
            bg="bg.subtle"
            variant="outline"
            type="submit"
            size="sm"
            disabled={loading}
          >
            {(loading && "Searching...") || "Search"}
          </Button>
        </Group>
        <Field.HelperText>
          {(results.length > 0 && (
            <Collapsible.Root>
              <Collapsible.Trigger mb={4}>
                Found {results.length} collection{results.length > 1 && "s"}...
              </Collapsible.Trigger>
              <Collapsible.Content>
                <NaturalLanguageCollectionSearchResults
                  results={results}
                ></NaturalLanguageCollectionSearchResults>
              </Collapsible.Content>
            </Collapsible.Root>
          )) ||
            "Natural language collection search is experimental, and can be rather slow"}
        </Field.HelperText>
      </Field.Root>
    </form>
  );
}

function NaturalLanguageCollectionSearchResults({
  results,
}: {
  results: NaturalLanguageCollectionSearchResult[];
}) {
  return (
    <DataList.Root size={"sm"}>
      {results.map((result) => (
        <DataList.Item key={result.collection_id}>
          <DataList.ItemLabel>{result.collection_id}</DataList.ItemLabel>
          <DataList.ItemValue>{result.explanation}</DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}

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

function LinkSelect({
  links,
  link,
  setLink,
}: {
  links: StacLink[];
  link: StacLink | undefined;
  setLink: Dispatch<SetStateAction<StacLink | undefined>>;
}) {
  const collection = createListCollection({
    items: links,
    itemToString: (link) => link.method as string,
    itemToValue: (link) => link.method as string,
  });
  return (
    <Select.Root
      collection={collection}
      onSelect={(e) => setLink(links.find((link) => link.method === e.value))}
      value={[link?.method as string]}
    >
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText></Select.ValueText>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((link) => (
              <Select.Item item={link} key={link.method as string}>
                {link.method as string}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
