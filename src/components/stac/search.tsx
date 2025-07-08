import {
  Accordion,
  Button,
  Card,
  CloseButton,
  Combobox,
  createListCollection,
  HStack,
  Popover,
  Portal,
  Progress,
  Span,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import type { StacCollection, StacLink } from "stac-ts";
import { useFitBbox, useSelectedCollections, useStacMap } from "../../hooks";
import Collection from "./collection";
import Item from "./item";
import ItemCollection from "./item-collection";
import { NaturalLanguageCollectionSearch } from "./natural-language";
import { getCollectionsExtent } from "./utils";

export default function Search({
  itemSearchLinks,
  naturalLanguageCollectionSearchHref,
}: {
  itemSearchLinks: StacLink[] | undefined;
  naturalLanguageCollectionSearchHref: string | undefined;
}) {
  const [value, setValue] = useState<string[] | undefined>();

  useEffect(() => {
    if (itemSearchLinks) {
      setValue(["item"]);
    } else if (naturalLanguageCollectionSearchHref) {
      setValue(["natural-language-collection"]);
    } else {
      setValue(undefined);
    }
  }, [itemSearchLinks, naturalLanguageCollectionSearchHref]);

  return (
    <Accordion.Root
      collapsible
      value={value}
      onValueChange={(e) => setValue(e.value)}
      variant={"enclosed"}
    >
      {itemSearchLinks && itemSearchLinks.length > 0 && (
        <Accordion.Item value="item">
          <Accordion.ItemTrigger>
            <Span flex="1">Item search</Span>
            <Accordion.ItemIndicator></Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent py={4}>
            <ItemSearch links={itemSearchLinks}></ItemSearch>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
      {naturalLanguageCollectionSearchHref && (
        <Accordion.Item value="natural-language-collection">
          <Accordion.ItemTrigger>
            <Span flex="1">Natural language collection search</Span>
            <Accordion.ItemIndicator></Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent py={4}>
            <NaturalLanguageCollectionSearch
              href={naturalLanguageCollectionSearchHref}
            ></NaturalLanguageCollectionSearch>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
    </Accordion.Root>
  );
}

function ItemSearch({ links }: { links: StacLink[] }) {
  const {
    collections,
    selectedCollections: selectedCollectionIds,
    searchRequest,
    setSearchRequest,
    searchItems,
    searchIsPending,
    searchNumberMatched,
    item,
  } = useStacMap();
  const selectedCollections = useSelectedCollections();
  const fitBbox = useFitBbox();

  return (
    <Stack gap={4}>
      {collections && (
        <CollectionCombobox collections={collections}></CollectionCombobox>
      )}
      <Wrap overflow={"scroll"}>
        {(selectedCollections &&
          selectedCollections.map((collection) => (
            <CollectionButton
              key={collection.id}
              collection={collection}
            ></CollectionButton>
          ))) || <Text fontSize={"sm"}>No collections selected</Text>}
      </Wrap>
      <HStack>
        <Button
          disabled={searchRequest && searchIsPending}
          variant={"surface"}
          onClick={() => {
            if (selectedCollections) {
              fitBbox(getCollectionsExtent(selectedCollections));
            }
            setSearchRequest({
              search: {
                collections: [...selectedCollectionIds],
              },
              // TODO allow configuration
              link: links[0],
            });
          }}
        >
          <LuSearch></LuSearch> Search
        </Button>
        {searchItems && (
          <Button
            variant={"surface"}
            onClick={() => setSearchRequest(undefined)}
          >
            <LuX></LuX> Clear
          </Button>
        )}
      </HStack>
      {searchRequest && searchIsPending && (
        <Progress.Root
          value={(searchNumberMatched && searchItems?.length) || null}
          max={searchNumberMatched}
        >
          <Progress.Track>
            <Progress.Range></Progress.Range>
          </Progress.Track>
        </Progress.Root>
      )}
      {searchItems && (
        <ItemCollection
          itemCollection={{
            type: "FeatureCollection",
            features: searchItems,
            title: "Search results",
            description: `Found ${searchItems.length} item${searchItems.length > 0 && "s"}`,
          }}
        ></ItemCollection>
      )}
      {item && (
        <Card.Root>
          <Card.Header>Selected item</Card.Header>
          <Card.Body>
            <Item item={item}></Item>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
}

function CollectionCombobox({
  collections,
}: {
  collections: StacCollection[];
}) {
  const { selectedCollections, selectedCollectionsDispatch } = useStacMap();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    [],
  );

  const filteredCollections = useMemo(() => {
    return collections.filter(
      (collection) =>
        collection.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        collection.id.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue, collections]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredCollections,
        itemToString: (collection) => collection.title || collection.id,
        itemToValue: (collection) => collection.id,
      }),
    [filteredCollections],
  );

  useEffect(() => {
    setSelectedCollectionIds([...selectedCollections]);
  }, [selectedCollections]);

  return (
    <Combobox.Root
      collection={collection}
      value={selectedCollectionIds}
      multiple
      closeOnSelect
      onValueChange={(details) =>
        selectedCollectionsDispatch({
          type: "set-selected-collections",
          collections: new Set(details.value),
        })
      }
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
    >
      <Combobox.Control>
        <Combobox.Input
          placeholder={
            (selectedCollections.size == 0 &&
              "Select one or more collections") ||
            `${selectedCollections.size} collection${(selectedCollections.size > 1 && "s") || ""} selected`
          }
        />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              {filteredCollections.map((collection) => (
                <Combobox.Item key={collection.id} item={collection}>
                  {collection.title || collection.id}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>No skills found</Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}

function CollectionButton({ collection }: { collection: StacCollection }) {
  const { selectedCollectionsDispatch } = useStacMap();
  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>
        <Button variant={"subtle"} size={"xs"}>
          {collection.title || collection.id}
          <CloseButton
            as={"a"}
            size={"2xs"}
            mr={-2}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              selectedCollectionsDispatch({
                type: "deselect-collection",
                id: collection.id,
              });
            }}
          ></CloseButton>
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow></Popover.Arrow>
            <Popover.Body overflow={"scroll"}>
              <Collection collection={collection}></Collection>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
