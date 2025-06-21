import { SimpleGrid, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuFilter, LuFolder, LuInfo } from "react-icons/lu";
import Filter from "./filter";
import Item from "./item";
import Metadata from "./metadata";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";

export default function Sidebar() {
  const { metadata, item, search } = useStacGeoparquet();
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
              <LuFolder></LuFolder>
            </Tabs.Trigger>
            <Tabs.Trigger value="filter" disabled={search === undefined}>
              <LuFilter></LuFilter>
            </Tabs.Trigger>
            <Tabs.Trigger value="item" disabled={item === undefined}>
              <LuInfo></LuInfo>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="metadata">
            <Metadata metadata={metadata}></Metadata>
          </Tabs.Content>
          <Tabs.Content value="filter">
            {(search && (
              <Filter search={search} metadata={metadata}></Filter>
            )) ||
              "No search set..."}
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
