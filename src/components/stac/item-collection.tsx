import {
  Button,
  Card,
  CloseButton,
  DataList,
  Drawer,
  EmptyState,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuEyeOff } from "react-icons/lu";
import { useFitBbox, useLayersDispatch, useSelected } from "../../hooks";
import { LayersProvider } from "../../providers";
import Loading from "../loading";
import { toaster } from "../ui/toaster";
import {
  useStacGeoparquet,
  useStacGeoparquetItem,
  type StacGeoparquetMetadata,
} from "./stac-geoparquet";
import type { StacItemCollection } from "./types";
import Value from "./value";

export default function ItemCollection({
  itemCollection,
  parquetPath,
}: {
  itemCollection: StacItemCollection;
  parquetPath: string | undefined;
}) {
  if (parquetPath) {
    return (
      <StacGeoparquetItemCollection
        path={parquetPath}
      ></StacGeoparquetItemCollection>
    );
  } else {
    return (
      <JsonItemCollection itemCollection={itemCollection}></JsonItemCollection>
    );
  }
}

function JsonItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  // TODO render
  return null;
}

function StacGeoparquetItemCollection({ path }: { path: string }) {
  const { layer, metadata, loading, error } = useStacGeoparquet(path);
  const dispatch = useLayersDispatch();
  const { stacGeoparquetId } = useSelected();

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error reading stac-geoparquet",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (layer) {
      dispatch({ type: "set-value", layer });
    } else {
      dispatch({ type: "set-value", layer: null });
    }
    dispatch({ type: "set-selected", layer: null });
  }, [layer, dispatch]);

  if (loading) {
    return <Loading></Loading>;
  } else {
    return (
      <Stack gap={8}>
        {metadata && <Metadata metadata={metadata}></Metadata>}
        {stacGeoparquetId && (
          <StacGeoparquetItem
            path={path}
            id={stacGeoparquetId}
          ></StacGeoparquetItem>
        )}
      </Stack>
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

function StacGeoparquetItem({ path, id }: { path: string; id: string }) {
  const { item, loading, error } = useStacGeoparquetItem(id, path);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error reading item from stac-geoparquet",
        description: error,
      });
    }
  }, [error]);

  if (loading) {
    return <Loading></Loading>;
  } else if (item) {
    return (
      <LayersProvider setLayers={undefined}>
        <Card.Root>
          <Card.Header>Selected item</Card.Header>
          <Card.Body>
            <Value value={item}></Value>
          </Card.Body>
        </Card.Root>
      </LayersProvider>
    );
  }
}
