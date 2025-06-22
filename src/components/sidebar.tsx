import { SimpleGrid, Tabs } from "@chakra-ui/react";
import { LuFolder, LuFolderPlus, LuFolderRoot, LuSearch } from "react-icons/lu";
import Container from "./container";
import Search from "./search";
import type { StacContainer } from "./stac/context";
import { useStac } from "./stac/hooks";

export default function Sidebar({ container }: { container: StacContainer }) {
  const { searchEndpoint } = useStac();
  let folderIcon;
  switch (container.type) {
    case "Catalog":
      folderIcon = <LuFolder></LuFolder>;
      break;
    case "Collection":
      folderIcon = <LuFolderPlus></LuFolderPlus>;
      break;
    case "FeatureCollection":
      folderIcon = <LuFolderRoot></LuFolderRoot>;
  }
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} my={2}>
      <Tabs.Root
        bg={"bg.muted"}
        pointerEvents={"auto"}
        defaultValue={"container"}
        rounded={"sm"}
        overflow={"scroll"}
        maxH={{ base: "40vh", md: "90vh" }}
        pb={4}
      >
        <Tabs.List>
          <Tabs.Trigger value="container">{folderIcon}</Tabs.Trigger>
          {searchEndpoint && (
            <Tabs.Trigger value="search">
              <LuSearch></LuSearch>
            </Tabs.Trigger>
          )}
        </Tabs.List>
        <Tabs.Content value="container" px={4}>
          <Container container={container}></Container>
        </Tabs.Content>
        {searchEndpoint && (
          <Tabs.Content value="search" px={4}>
            <Search searchEndpoint={searchEndpoint}></Search>
          </Tabs.Content>
        )}
      </Tabs.Root>
    </SimpleGrid>
  );
}
