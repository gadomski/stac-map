import {
  ActionBar,
  Badge,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Dialog,
  For,
  Heading,
  HStack,
  IconButton,
  Image,
  List,
  Portal,
  SegmentGroup,
  SimpleGrid,
  Span,
  Stack,
  Text,
  type IconButtonProps,
} from "@chakra-ui/react";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useState, type Dispatch } from "react";
import { LuFocus, LuInfo, LuList, LuTable, LuX } from "react-icons/lu";
import { useMap } from "react-map-gl/maplibre";
import { MarkdownHooks } from "react-markdown";
import type { StacCollection } from "stac-ts";
import { type SelectedCollectionsAction } from "../../context";
import { useFitBbox, useIsCollectionSelected, useStacMap } from "../../hooks";
import { Prose } from "../ui/prose";
import { getCollectionsExtent, isCollectionWithinDateRange } from "./utils";
import Value from "./value";

export function Collections({
  collections,
}: {
  collections: StacCollection[];
}) {
  const [display, setDisplay] = useState<string | null>("cards");
  const items = [
    { value: "list", label: <LuList></LuList> },
    { value: "cards", label: <LuTable></LuTable> },
  ];
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [filterToMapBounds, setFilterToMapBounds] = useState(false);
  const [bounds, setBounds] = useState<LngLatBounds>();
  const { map } = useMap();
  const { dateRange } = useStacMap();

  useEffect(() => {
    let filtered = collections;
    
    if (filterToMapBounds && bounds) {
      filtered = filtered.filter((collection) =>
        isCollectionWithinBounds(collection, bounds),
      );
    }
    
    if (dateRange && (dateRange.startDate || dateRange.endDate)) {
      filtered = filtered.filter((collection) =>
        isCollectionWithinDateRange(collection, dateRange),
      );
    }
    
    setFilteredCollections(filtered);
  }, [filterToMapBounds, map, collections, bounds, dateRange]);

  useEffect(() => {
    if (map) {
      setBounds(map.getBounds());

      const onMoveend = () => {
        setBounds(map.getBounds());
      };

      map.on("moveend", onMoveend);

      return () => {
        map.off("moveend", onMoveend);
      };
    }
  }, [map]);

  return (
    <>
      <Stack>
        <Heading size={"lg"}>
          <HStack>
            Collections{" "}
            <Badge>
              {filterToMapBounds && filteredCollections.length + " / "}
              {collections.length}
            </Badge>
          </HStack>
        </Heading>
        <HStack mb={2} gap={4}>
          <SegmentGroup.Root
            value={display}
            onValueChange={(e) => setDisplay(e.value)}
            size={"xs"}
          >
            <SegmentGroup.Indicator></SegmentGroup.Indicator>
            <SegmentGroup.Items items={items}></SegmentGroup.Items>
          </SegmentGroup.Root>

          <Checkbox.Root
            variant={"subtle"}
            size={"sm"}
            checked={filterToMapBounds}
            onCheckedChange={(e) => setFilterToMapBounds(!!e.checked)}
          >
            <Checkbox.HiddenInput></Checkbox.HiddenInput>
            <Checkbox.Control></Checkbox.Control>
            <Checkbox.Label fontWeight={"light"}>
              Filter to map bounds
            </Checkbox.Label>
          </Checkbox.Root>
        </HStack>
        {(display === "list" && (
          <CollectionList collections={filteredCollections}></CollectionList>
        )) || (
          <CollectionCards collections={filteredCollections}></CollectionCards>
        )}
      </Stack>
    </>
  );
}

interface CollectionsProps {
  collections: StacCollection[];
}

function CollectionList({ collections }: CollectionsProps) {
  return (
    <List.Root variant={"plain"} gap={2}>
      <For each={collections}>
        {(collection) => {
          const dateInterval = getCollectionDateInterval(collection);
          return (
            <List.Item key={collection.id}>
              <Stack gap={0}>
                <Text>{collection.title || collection.id}</Text>
                <Text ml={4} fontSize={"xs"} fontWeight={"lighter"}>
                  {dateInterval || "Invalid temporal extent"}
                </Text>
              </Stack>
              <HStack gap={0} marginLeft={"auto"}>
                <CollectionButtons
                  collection={collection}
                  size={"2xs"}
                  variant={"plain"}
                ></CollectionButtons>
              </HStack>
            </List.Item>
          );
        }}
      </For>
    </List.Root>
  );
}

function CollectionCards({ collections }: CollectionsProps) {
  return (
    <SimpleGrid columns={2} gap={2}>
      {collections.map((collection) => (
        <CollectionCard
          collection={collection}
          key={collection.id}
        ></CollectionCard>
      ))}
    </SimpleGrid>
  );
}

function CollectionCard({ collection }: { collection: StacCollection }) {
  const thumbnailLink = collection.assets?.thumbnail;
  const dateInterval = getCollectionDateInterval(collection);

  return (
    <Card.Root size={"sm"} variant={"elevated"}>
      <Card.Header>
        {collection.title && (
          <Text fontWeight={"lighter"} fontSize={"2xs"}>
            {collection.id}
          </Text>
        )}
      </Card.Header>
      <Card.Body>
        <Stack>
          <Heading fontSize={"sm"} lineHeight={1.5}>
            {collection.title ?? collection.id}
          </Heading>
          <Text
            fontSize={"xs"}
            fontWeight={"lighter"}
            color={dateInterval ? "inherit" : "fg.muted"}
          >
            {dateInterval || "Invalid collection metadata"}
          </Text>
        </Stack>
        {collection.description && (
          <Prose size={"md"} lineClamp={2} fontSize={"xs"}>
            <MarkdownHooks>{collection.description}</MarkdownHooks>
          </Prose>
        )}
      </Card.Body>
      <Card.Footer>
        <Stack gap={4} w="full">
          {thumbnailLink && <Image src={thumbnailLink.href}></Image>}
          <HStack w={"full"}>
            <CollectionButtons
              collection={collection}
              size={"2xs"}
              variant={"surface"}
            ></CollectionButtons>
          </HStack>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}

interface CollectionButtonProps extends IconButtonProps {
  collection: StacCollection;
}

function CollectionButtons({ collection, ...rest }: CollectionButtonProps) {
  const [open, setOpen] = useState(false);
  const selected = useIsCollectionSelected(collection.id);
  const fitBbox = useFitBbox();
  const { selectedCollectionsDispatch } = useStacMap();

  return (
    <>
      <IconButton {...rest} onClick={() => setOpen(true)}>
        <LuInfo></LuInfo>
      </IconButton>
      <IconButton
        {...rest}
        disabled={!collection.extent?.spatial?.bbox?.[0]}
        onClick={() => fitBbox(collection.extent?.spatial?.bbox?.[0])}
      >
        <LuFocus></LuFocus>
      </IconButton>
      <Span flex={"1"}></Span>

      <Checkbox.Root
        checked={selected}
        onCheckedChange={(e) => {
          if (e.checked) {
            selectedCollectionsDispatch({
              type: "select-collection",
              id: collection.id,
            });
          } else {
            selectedCollectionsDispatch({
              type: "deselect-collection",
              id: collection.id,
            });
          }
        }}
      >
        <Checkbox.HiddenInput></Checkbox.HiddenInput>
        <Checkbox.Control></Checkbox.Control>
      </Checkbox.Root>

      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size={"lg"}
      >
        <Portal>
          <Dialog.Backdrop></Dialog.Backdrop>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header></Dialog.Header>
              <Dialog.Body>
                <Collection collection={collection}></Collection>
              </Dialog.Body>
              <Dialog.Footer></Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

function getCollectionDateInterval(collection: StacCollection): string | null {
  if (!collection.extent?.temporal?.interval?.[0]) {
    return null;
  }

  const temporalExtents = collection.extent.temporal.interval[0];
  let start = "";
  let end = "";
  if (temporalExtents[0]) {
    start = new Date(temporalExtents[0]).toLocaleDateString();
  }
  if (temporalExtents[1]) {
    end = new Date(temporalExtents[1]).toLocaleDateString();
  }
  return `${start} - ${end}`;
}

export default function Collection({
  collection,
}: {
  collection: StacCollection;
}) {
  return <Value value={collection}></Value>;
}

function isCollectionWithinBounds(
  collection: StacCollection,
  bounds: LngLatBounds,
) {
  if (!collection.extent?.spatial?.bbox?.[0]) {
    return false;
  }

  const bbox = collection.extent.spatial.bbox[0];
  let collectionBounds;
  if (bbox.length == 4) {
    collectionBounds = [bbox[0], bbox[1], bbox[2], bbox[3]];
  } else {
    // assume 6
    collectionBounds = [bbox[0], bbox[1], bbox[3], bbox[4]];
  }
  return (
    collectionBounds[0] <= bounds.getEast() &&
    collectionBounds[2] >= bounds.getWest() &&
    collectionBounds[1] <= bounds.getNorth() &&
    collectionBounds[3] >= bounds.getSouth() &&
    (collectionBounds[0] >= bounds.getWest() ||
      collectionBounds[1] >= bounds.getSouth() ||
      collectionBounds[2] <= bounds.getEast() ||
      collectionBounds[3] <= bounds.getNorth())
  );
}

export function SelectedCollectionsActionBar({
  collections,
  dispatch,
}: {
  collections: StacCollection[];
  dispatch: Dispatch<SelectedCollectionsAction>;
}) {
  const fitBbox = useFitBbox();

  return (
    <ActionBar.Root open={collections.length > 0}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {collections.length} collection{collections.length > 1 && "s"}{" "}
              selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator></ActionBar.Separator>
            <IconButton
              variant={"outline"}
              size={"xs"}
              onClick={() => fitBbox(getCollectionsExtent(collections))}
            >
              <LuFocus></LuFocus>
            </IconButton>
            <Button
              size={"xs"}
              variant={"outline"}
              onClick={() => dispatch({ type: "deselect-all-collections" })}
            >
              <LuX></LuX> Deselect all
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
