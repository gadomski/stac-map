import {
  Button,
  Card,
  CloseButton,
  DataList,
  DownloadTrigger,
  Drawer,
  EmptyState,
  FormatNumber,
  HStack,
  IconButton,
  Portal,
  Stack,
  Stat,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { LuDownload, LuEyeOff, LuFileJson, LuFocus } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { useFitBbox, useStacMap } from "../../hooks";
import Loading from "../loading";
import Item from "./item";
import { type StacGeoparquetMetadata } from "./stac-geoparquet";
import type { StacItemCollection } from "./types";
import { getItemCollectionExtent, isItemWithinDateRange } from "./utils";
import Value from "./value";

export default function ItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  const {
    stacGeoparquetMetadata,
    stacGeoparquetMetadataIsPending,
    stacGeoparquetItem,
    dateRange,
  } = useStacMap();
  const fitBbox = useFitBbox();

  const filteredFeatures = useMemo(() => {
    if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
      return itemCollection.features;
    }

    return itemCollection.features.filter((feature) =>
      isItemWithinDateRange(feature, dateRange)
    );
  }, [itemCollection.features, dateRange]);

  const filteredItemCollection = useMemo(() => ({
    ...itemCollection,
    features: filteredFeatures,
  }), [itemCollection, filteredFeatures]);

  const isFilterActive = dateRange && (dateRange.startDate || dateRange.endDate);

  return (
    <Stack>
      <Value value={filteredItemCollection} type="Item collection"></Value>
      
      {isFilterActive && (
        <Card.Root variant="elevated" bg="blue.50" borderColor="blue.200">
          <Card.Body py={2}>
            <Text fontSize="sm" color="blue.700">
              <strong>Date Filter Active:</strong> Showing {filteredFeatures.length} of {itemCollection.features.length} items
            </Text>
          </Card.Body>
        </Card.Root>
      )}
      
      <HStack>
        <DownloadTrigger
          asChild
          data={JSON.stringify(itemCollection)}
          fileName={itemCollection.id || "item-collection" + ".json"}
          mimeType="application/json"
        >
          <IconButton size={"sm"} variant={"subtle"}>
            <LuDownload></LuDownload>
          </IconButton>
        </DownloadTrigger>
        {filteredFeatures.length > 0 && (
          <IconButton
            size={"sm"}
            variant={"subtle"}
            onClick={() => fitBbox(getItemCollectionExtent(filteredItemCollection))}
          >
            <LuFocus></LuFocus>
          </IconButton>
        )}
      </HStack>
      {stacGeoparquetMetadataIsPending && <Loading></Loading>}
      {stacGeoparquetMetadata && (
        <StacGeoparquetMetadata
          metadata={stacGeoparquetMetadata}
        ></StacGeoparquetMetadata>
      )}
      {stacGeoparquetItem && (
        <StacGeoparquetItem item={stacGeoparquetItem}></StacGeoparquetItem>
      )}
    </Stack>
  );
}

function StacGeoparquetMetadata({
  metadata,
}: {
  metadata: StacGeoparquetMetadata;
}) {
  const { dateRange } = useStacMap();
  const isFilterActive = dateRange && (dateRange.startDate || dateRange.endDate);

  return (
    <Stack gap={4}>
      <Stat.Root>
        <Stat.Label>Number of items</Stat.Label>
        <Stat.ValueText>
          <FormatNumber value={metadata.count}></FormatNumber>
        </Stat.ValueText>
      </Stat.Root>
      
      {isFilterActive && (
        <Card.Root variant="elevated" bg="green.50" borderColor="green.200">
          <Card.Body py={2}>
            <Text fontSize="sm" color="green.700">
              <strong>Date Filter Active:</strong> Showing {metadata.count} filtered items
            </Text>
          </Card.Body>
        </Card.Root>
      )}
      
      <HStack>
        <MetadataDrawer metadata={metadata}></MetadataDrawer>
      </HStack>
    </Stack>
  );
}

function StacGeoparquetItem({ item }: { item: StacItem }) {
  return (
    <Card.Root>
      <Card.Header>Selected item</Card.Header>
      <Card.Body>
        <Item item={item}></Item>
      </Card.Body>
    </Card.Root>
  );
}

function MetadataDrawer({ metadata }: { metadata: StacGeoparquetMetadata }) {
  return (
    <Drawer.Root size={"md"}>
      <Drawer.Trigger asChild>
        <Button variant={"surface"} size={"md"}>
          View metadata <LuFileJson></LuFileJson>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop></Drawer.Backdrop>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>stac-geoparquet metadata</Drawer.Title>
            </Drawer.Header>
            <Drawer.Content h={"full"} overflow={"scroll"}>
              <DataList.Root p={4}>
                {metadata.keyValue.map((kv) => {
                  return (
                    <DataList.Item key={kv.key}>
                      <DataList.ItemLabel>{kv.key}</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <MetadataValue kv={kv}></MetadataValue>
                      </DataList.ItemValue>
                    </DataList.Item>
                  );
                })}
              </DataList.Root>
            </Drawer.Content>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

function MetadataValue({
  kv: { key, value },
}: {
  // eslint-disable-next-line
  kv: { key: string; value: any };
}) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return Number(value.toFixed(4)).toString();
    case "object":
      return (
        <DataList.Root px={4}>
          {Object.entries(value).map(([k, v]) => (
            <DataList.Item key={key + k}>
              <DataList.ItemLabel>{k}</DataList.ItemLabel>
              <DataList.ItemValue>
                <MetadataValue kv={{ key: key + k, value: v }}></MetadataValue>
              </DataList.ItemValue>
            </DataList.Item>
          ))}
        </DataList.Root>
      );
    default:
      return (
        <EmptyState.Root size={"sm"}>
          <EmptyState.Indicator>
            <LuEyeOff></LuEyeOff>
          </EmptyState.Indicator>
        </EmptyState.Root>
      );
  }
}
