import {
  Badge,
  Checkbox,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuFolder } from "react-icons/lu";
import type { StacCatalog, StacCollection } from "stac-ts";
import { useMap, useMapDispatch } from "../map/context";
import { InfoTip } from "../ui/toggle-tip";
import { CollectionCard } from "./collection";
import { ValueInfo } from "./shared";
import { filterCollections, getCollectionExtents } from "./utils";

function Collections({
  collections,
  setHref,
  setLayers,
}: {
  collections: StacCollection[];
  setHref: Dispatch<SetStateAction<string>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [includeGlobalCollections, setIncludeGlobalCollections] =
    useState(true);
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const { bounds } = useMap();
  const dispatch = useMapDispatch();

  useEffect(() => {
    const { layer, bbox } = getCollectionExtents(collections, "collections");
    setLayers([layer]);
    dispatch({
      type: "set-fit-bbox",
      bbox,
    });
  }, [collections, dispatch, setLayers]);

  useEffect(() => {
    setFilteredCollections(
      filterCollections(collections, bounds, includeGlobalCollections),
    );
  }, [bounds, collections, includeGlobalCollections]);

  return (
    <Stack>
      <HStack mt={4}>
        <Heading size={"md"}>Collections</Heading>
        <InfoTip content="Filtered to the current viewport"></InfoTip>
        <Badge>
          {filteredCollections.length} / {collections.length}
        </Badge>
        <Checkbox.Root
          size={"sm"}
          variant={"subtle"}
          checked={includeGlobalCollections}
          onCheckedChange={(e) => setIncludeGlobalCollections(!!e.checked)}
        >
          <Checkbox.HiddenInput></Checkbox.HiddenInput>
          <Checkbox.Control></Checkbox.Control>
          <Checkbox.Label>Include global collections</Checkbox.Label>
        </Checkbox.Root>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
        {filteredCollections.map((collection) => (
          <CollectionCard
            collection={collection}
            setHref={setHref}
            key={collection.id}
          ></CollectionCard>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export function Catalog({
  catalog,
  collections,
  setHref,
  setLayers,
}: {
  catalog: StacCatalog;
  collections?: StacCollection[];
  setHref: Dispatch<SetStateAction<string>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  return (
    <Stack>
      <ValueInfo
        type={"Catalog"}
        value={catalog}
        id={catalog.id}
        icon={<LuFolder></LuFolder>}
        title={catalog.title}
        description={catalog.description}
      ></ValueInfo>

      {collections && collections.length > 0 && (
        <Collections
          collections={collections}
          setHref={setHref}
          setLayers={setLayers}
        ></Collections>
      )}
    </Stack>
  );
}
