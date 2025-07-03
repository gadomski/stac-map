import {
  Button,
  Card,
  CloseButton,
  DataList,
  Drawer,
  EmptyState,
  Heading,
  Portal,
  Stack,
} from "@chakra-ui/react";
import type { Table } from "apache-arrow";
import { useEffect } from "react";
import { LuEyeOff } from "react-icons/lu";
import { useAppDispatch, useFitBbox } from "../../hooks";
import Loading from "../loading";
import { toaster } from "../ui/toaster";
import Item from "./item";
import {
  getItemCollectionLayer,
  getItemLayer,
  useStacGeoparquetLayer,
} from "./layers";
import {
  useStacGeoparquet,
  type StacGeoparquetMetadata,
} from "./stac-geoparquet";
import type { StacItemCollection } from "./types";
import { getItemCollectionExtent } from "./utils";
import Value from "./value";

export default function ItemCollection({
  itemCollection,
  parquetPath,
}: {
  itemCollection: StacItemCollection;
  parquetPath: string | undefined;
}) {
  return (
    <Stack>
      <Value value={itemCollection} type="Item collection"></Value>
      {(parquetPath && (
        <StacGeoparquetItemCollection
          path={parquetPath}
        ></StacGeoparquetItemCollection>
      )) || (
        <JsonItemCollection
          itemCollection={itemCollection}
        ></JsonItemCollection>
      )}
    </Stack>
  );
}

function JsonItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  const fitBbox = useFitBbox();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({
      type: "set-layer",
      layer: getItemCollectionLayer(itemCollection),
    });
  }, [itemCollection, dispatch]);

  useEffect(() => {
    const bbox = getItemCollectionExtent(itemCollection);
    fitBbox(bbox);
  }, [fitBbox, itemCollection]);

  return null;
}

function StacGeoparquetItemCollection({ path }: { path: string }) {
  const { table, metadata, loading, error } = useStacGeoparquet(path);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error reading stac-geoparquet",
        description: error,
      });
    }
  }, [error]);

  if (loading) {
    return <Loading></Loading>;
  } else {
    return (
      <>
        <Stack>
          {metadata && <Metadata metadata={metadata}></Metadata>}
          {table && (
            <LayerWithItemPicker
              path={path}
              table={table}
            ></LayerWithItemPicker>
          )}
        </Stack>
      </>
    );
  }
}

function LayerWithItemPicker({ table, path }: { table: Table; path: string }) {
  const dispatch = useAppDispatch();
  const { layer, item, error } = useStacGeoparquetLayer(table, path);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error creating the stac-geoparquet layer",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (layer) {
      dispatch({ type: "set-layer", layer });
    }
  }, [layer, dispatch]);

  useEffect(() => {
    if (item?.geometry) {
      dispatch({
        type: "set-picked-layer",
        layer: getItemLayer(item).clone({
          getFillColor: [48, 192, 253, 100],
          getLineColor: [48, 192, 253, 200],
        }),
      });
    } else {
      dispatch({ type: "set-picked-layer", layer: null });
    }
  }, [item, dispatch]);

  if (item) {
    return (
      <>
        <Heading size={"sm"} mt={4}>
          Picked item
        </Heading>
        <Card.Root size={"sm"}>
          <Card.Body>
            <Item item={item} map={false}></Item>;
          </Card.Body>
        </Card.Root>
      </>
    );
  }
}

function Metadata({ metadata }: { metadata: StacGeoparquetMetadata }) {
  const fitBbox = useFitBbox();

  useEffect(() => {
    fitBbox(metadata.bbox);
  }, [metadata.bbox, fitBbox]);

  return (
    <DataList.Root orientation={"horizontal"}>
      <DataList.Item>
        <DataList.ItemLabel>Number of items</DataList.ItemLabel>
        <DataList.ItemValue>
          {metadata.count} item{metadata.count > 1 && "s"}
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Metadata</DataList.ItemLabel>
        <DataList.ItemValue>
          <MetadataDrawer metadata={metadata}></MetadataDrawer>
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

function MetadataDrawer({ metadata }: { metadata: StacGeoparquetMetadata }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant={"subtle"} size={"xs"}>
          View
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
              <DataList.Root p={2}>
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
        <DataList.Root px={2}>
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
