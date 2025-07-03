import {
  Badge,
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
import { useEffect, useState } from "react";
import { LuFocus, LuInfo, LuList, LuTable } from "react-icons/lu";
import { useMap } from "react-map-gl/maplibre";
import { MarkdownHooks } from "react-markdown";
import type { StacCollection } from "stac-ts";
import { useAppDispatch, useCollectionSelected, useFitBbox } from "../../hooks";
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
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const [filterToMapBounds, setFilterToMapBounds] = useState(false);
  const [bounds, setBounds] = useState<LngLatBounds>();
  const { map } = useMap();
  const dispatch = useAppDispatch();
  const fitBbox = useFitBbox();

  useEffect(() => {
    dispatch({
      type: "set-layer",
      layer: getCollectionsLayer(collections, false),
    });
    dispatch({
      type: "set-collections",
      collections,
    });
  }, [dispatch, collections]);

  useEffect(() => {
    fitBbox(getCollectionsExtent(collections));
  }, [collections, fitBbox]);

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
  const setFitBbox = useFitBbox();
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const selected = useCollectionSelected(collection.id);

  useEffect(() => {
    setChecked(selected);
  }, [selected]);

  useEffect(() => {
    if (disabled) {
      if (selected == checked) {
        setChecked(selected);
        setDisabled(false);
      }
    } else {
      setChecked(selected);
    }
  }, [collection, selected, disabled, checked]);

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
                <Collection collection={collection} map={false}></Collection>
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
  map,
}: {
  collection: StacCollection;
  map?: boolean;
}) {
  const fitBbox = useFitBbox();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const layer = getCollectionLayer(collection);
    if (map && layer) {
      dispatch({ type: "set-layer", layer });
    }
  }, [dispatch, collection, map]);

  useEffect(() => {
    if (map && collection.extent?.spatial?.bbox?.[0]) {
      fitBbox(sanitizeBbox(collection.extent.spatial.bbox[0]));
    }
  }, [collection, fitBbox, map]);

  return <Value value={collection}></Value>;
}
