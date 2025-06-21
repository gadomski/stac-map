import { SimpleGrid, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuFolder, LuFolderMinus, LuInfo } from "react-icons/lu";
import Item from "./item";
import Metadata from "./metadata";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";

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
      <SimpleGrid columns={{ base: 1, md: 3 }} my={2}>
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
          maxH={{ base: "40vh", md: "90vh" }}
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
