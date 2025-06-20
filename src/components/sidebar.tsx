import { DataList, SimpleGrid, Tabs, Text } from "@chakra-ui/react";
import { LuFolder, LuFolderMinus } from "react-icons/lu";
import type { StacGeoparquetMetadata } from "./stac-geoparquet/context";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";

function Info({
  metadata,
  id,
}: {
  metadata?: StacGeoparquetMetadata;
  id?: string;
}) {
  if (metadata) {
    return (
      <DataList.Root orientation={"horizontal"} size={"sm"}>
        <DataList.Item>
          <DataList.ItemLabel>Count</DataList.ItemLabel>
          <DataList.ItemValue>{metadata.count}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Active item</DataList.ItemLabel>
          <DataList.ItemValue>{id || "none"}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    );
  } else {
    return <Text>No file loaded...</Text>;
  }
}

export default function Sidebar() {
  const { metadata, id } = useStacGeoparquet();

  return (
    <SimpleGrid columns={3} my={2} pointerEvents={"auto"}>
      <Tabs.Root
        bg={"bg.muted"}
        px={4}
        pt={2}
        pb={4}
        fontSize={"sm"}
        rounded={"sm"}
        defaultValue={"info"}
      >
        <Tabs.List>
          <Tabs.Trigger value="info">
            {(metadata && <LuFolder></LuFolder>) || (
              <LuFolderMinus></LuFolderMinus>
            )}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="info">
          <Info metadata={metadata} id={id}></Info>
        </Tabs.Content>
      </Tabs.Root>
    </SimpleGrid>
  );
}
