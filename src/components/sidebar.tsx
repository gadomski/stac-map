import {
  Card,
  DataList,
  Heading,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  LuExternalLink,
  LuFolder,
  LuFolderMinus,
  LuInfo,
} from "react-icons/lu";
import type { StacItem } from "stac-ts";
import type { StacGeoparquetMetadata } from "./stac-geoparquet/context";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";

function Metadata({ metadata }: { metadata: StacGeoparquetMetadata }) {
  return (
    <DataList.Root orientation={"horizontal"} size={"sm"}>
      <DataList.Item>
        <DataList.ItemLabel>Count</DataList.ItemLabel>
        <DataList.ItemValue>{metadata.count}</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Start datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {metadata.startDatetime.toLocaleDateString()}
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>End datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {metadata.endDatetime.toLocaleDateString()}
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

function Item({ item }: { item: StacItem }) {
  return (
    <Stack>
      <DataList.Root orientation={"horizontal"} size={"sm"}>
        <DataList.Item>
          <DataList.ItemLabel>ID</DataList.ItemLabel>
          <DataList.ItemValue>{item.id}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>STAC version</DataList.ItemLabel>
          <DataList.ItemValue>{item.stac_version}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>

      <Heading size={"sm"} mt={4}>
        Assets
      </Heading>

      <SimpleGrid columns={2} gap={2}>
        {Object.entries(item.assets).map(([key, asset]) => {
          // TODO make this configurable
          const showImage =
            asset.type && ["image/jpeg", "image/png"].includes(asset.type);
          return (
            <Card.Root key={item.id + key} size={"sm"}>
              <Card.Header>{key}</Card.Header>
              <Card.Body>
                {asset.title && <Card.Title>{asset.title}</Card.Title>}
                {asset.description && (
                  <Card.Description>{asset.description}</Card.Description>
                )}
                {showImage && <Image src={asset.href} maxH={200} />}
              </Card.Body>
              <Card.Footer>
                <Link href={asset.href}>
                  <IconButton variant={"plain"} size={"sm"}>
                    <LuExternalLink></LuExternalLink>
                  </IconButton>
                </Link>
              </Card.Footer>
            </Card.Root>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

export default function Sidebar() {
  const { metadata, item } = useStacGeoparquet();
  const [value, setValue] = useState("metadata");

  useEffect(() => {
    if (item) {
      setValue("item");
    } else {
      setValue("metadata");
    }
  }, [item]);

  if (metadata) {
    return (
      <SimpleGrid columns={3} my={2}>
        <Tabs.Root
          bg={"bg.muted"}
          px={4}
          pt={2}
          pb={4}
          fontSize={"sm"}
          rounded={"sm"}
          value={value}
          onValueChange={(e) => setValue(e.value)}
          pointerEvents={"auto"}
          overflow={"scroll"}
          maxH={"90vh"}
        >
          <Tabs.List>
            <Tabs.Trigger value="metadata">
              {(metadata && <LuFolder></LuFolder>) || (
                <LuFolderMinus></LuFolderMinus>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger value="item" disabled={item === undefined}>
              <LuInfo></LuInfo>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="metadata">
            {(metadata && <Metadata metadata={metadata}></Metadata>) ||
              "No file loaded..."}
          </Tabs.Content>
          <Tabs.Content value="item">
            {(item && <Item item={item}></Item>) || "No item selected..."}
          </Tabs.Content>
        </Tabs.Root>
      </SimpleGrid>
    );
  } else {
    return <></>;
  }
}
