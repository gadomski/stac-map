import {
  ActionBar,
  Badge,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Dialog,
  Drawer,
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
import { useEffect, useMemo, useState } from "react";
import { LuFocus, LuInfo, LuList, LuTable, LuX } from "react-icons/lu";
import { useMap } from "react-map-gl/maplibre";
import { MarkdownHooks } from "react-markdown";
import type { StacCollection } from "stac-ts";
import {
  useFitBbox,
  useIsCollectionSelected,
  useLayersDispatch,
  useSelected,
  useSelectedDispatch,
} from "../../hooks";
import { LayersProvider } from "../../providers";
import { Prose } from "../ui/prose";
import { getCollectionLayer, getCollectionsLayer } from "./layers";
import {
  getCollectionsExtent,
  isCollectionWithinBounds,
  sanitizeBbox,
} from "./utils";
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
  const dispatch = useLayersDispatch();
  const { collectionIds } = useSelected();
  const selectedCollections = useMemo(() => {
    return collections.filter((collection) => collectionIds.has(collection.id));
  }, [collectionIds, collections]);
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [filterToMapBounds, setFilterToMapBounds] = useState(false);
  const [bounds, setBounds] = useState<LngLatBounds>();
  const { map } = useMap();

  useEffect(() => {
    dispatch({
      type: "set-value",
      layer: getCollectionsLayer(collections, false),
    });
  }, [collections, dispatch]);

  useEffect(() => {
    dispatch({
      type: "set-selected",
      layer: getCollectionsLayer(selectedCollections, true),
    });
  }, [selectedCollections, dispatch]);

  useEffect(() => {
    if (filterToMapBounds && bounds) {
      setFilteredCollections(
        collections.filter((collection) =>
          isCollectionWithinBounds(collection, bounds),
        ),
      );
    } else {
      setFilteredCollections(collections);
    }
  }, [filterToMapBounds, map, setFilteredCollections, collections, bounds]);

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
              {filteredCollections.length < collections.length &&
                filteredCollections.length + " / "}
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
      <SelectedCollectionsActionBar
        collections={selectedCollections}
      ></SelectedCollectionsActionBar>
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
  const isCollectionSelected = useIsCollectionSelected(collection);
  const dateInterval = getCollectionDateInterval(collection);

  return (
    <Card.Root
      size={"sm"}
      variant={"elevated"}
      borderColor={(isCollectionSelected && "fg.muted") || "fg.subtle"}
    >
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
  const setFitBbox = useFitBbox();
  const isCollectionSelected = useIsCollectionSelected(collection);
  const [checked, setChecked] = useState(isCollectionSelected);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useSelectedDispatch();

  useEffect(() => {
    if (disabled && isCollectionSelected === checked) {
      setDisabled(false);
    } else {
      setChecked(isCollectionSelected);
    }
  }, [isCollectionSelected, checked, setChecked, setDisabled, disabled]);

  return (
    <>
      <IconButton {...rest} onClick={() => setOpen(true)}>
        <LuInfo></LuInfo>
      </IconButton>
      <IconButton
        {...rest}
        onClick={() => {
          if (collection.extent?.spatial?.bbox?.[0]) {
            setFitBbox(collection.extent.spatial.bbox[0]);
          }
        }}
        disabled={!collection.extent?.spatial?.bbox?.[0]}
      >
        <LuFocus></LuFocus>
      </IconButton>
      <Span flex={"1"}></Span>

      <Checkbox.Root
        ml={1}
        variant={"subtle"}
        size={"md"}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(e) => {
          setDisabled(true);
          setChecked(!!e.checked);
          if (e.checked) {
            dispatch({ type: "select-collection", id: collection.id });
          } else {
            dispatch({ type: "deselect-collection", id: collection.id });
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
                <LayersProvider setLayers={undefined}>
                  <Value value={collection}></Value>
                </LayersProvider>
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

function SelectedCollectionsActionBar({
  collections,
}: {
  collections: StacCollection[];
}) {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useSelectedDispatch();
  const setFitBbox = useFitBbox();

  useEffect(() => {
    if (collections.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [collections]);

  return (
    <>
      <ActionBar.Root open={open}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {collections.length} collection
                {collections.length > 1 && "s"} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator></ActionBar.Separator>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => dispatch({ type: "deselect-all-collections" })}
              >
                <LuX></LuX>
                Deselect all
              </Button>
              <IconButton
                variant={"outline"}
                size={"sm"}
                onClick={() => setFitBbox(getCollectionsExtent(collections))}
              >
                <LuFocus></LuFocus>
              </IconButton>
              <IconButton
                variant={"outline"}
                size={"sm"}
                onClick={() => setDrawerOpen(true)}
              >
                <LuInfo></LuInfo>
              </IconButton>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(e) => setDrawerOpen(e.open)}
        size={"lg"}
      >
        <Portal>
          <Drawer.Backdrop></Drawer.Backdrop>
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Selected collections</Drawer.Title>
              </Drawer.Header>
              <Drawer.Content h={"full"} p={4}>
                <CollectionList collections={collections}></CollectionList>
              </Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}

export default function Collection({
  collection,
}: {
  collection: StacCollection;
}) {
  const dispatch = useLayersDispatch();
  const fitBbox = useFitBbox();

  useEffect(() => {
    dispatch({ type: "set-value", layer: getCollectionLayer(collection) });
    dispatch({ type: "set-selected", layer: null });
  }, [collection, dispatch]);

  useEffect(() => {
    if (collection.extent?.spatial?.bbox?.[0]) {
      fitBbox(sanitizeBbox(collection.extent.spatial.bbox[0]));
    }
  }, [collection, fitBbox]);

  return <Value value={collection}></Value>;
}
