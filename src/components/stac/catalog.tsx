import {
  Badge,
  Checkbox,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { BBox } from "geojson";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuFolder } from "react-icons/lu";
import type { StacCatalog, StacCollection } from "stac-ts";
import { useMap, useMapDispatch } from "../map/context";
import { InfoTip } from "../ui/toggle-tip";
import { CollectionCard } from "./collection";
import { ValueInfo } from "./shared";
import { filterCollections, sanitizeBbox } from "./utils";

function Collections({
  collections,
  setHref,
}: {
  collections: StacCollection[];
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const [includeGlobalCollections, setIncludeGlobalCollections] =
    useState(true);
  const [filteredCollections, setFilteredCollections] = useState(collections);
  const { bounds } = useMap();
  const dispatch = useMapDispatch();

  useEffect(() => {
    const collectionBbox = [-180, -90, 180, 90];
    const polygons = collections.map((collection) => {
      const bbox = sanitizeBbox(collection.extent.spatial.bbox[0]);
      collectionBbox[0] = Math.min(collectionBbox[0], bbox[0]);
      collectionBbox[1] = Math.min(collectionBbox[1], bbox[1]);
      collectionBbox[2] = Math.max(collectionBbox[2], bbox[2]);
      collectionBbox[3] = Math.max(collectionBbox[3], bbox[3]);
      return bboxPolygon(bbox as BBox);
    });
    const polygonLayer = new GeoJsonLayer({
      id: "collection-polygons",
      data: polygons,
      stroked: true,
      filled: false,
      getLineColor: [207, 63, 2],
      lineWidthUnits: "pixels",
    });
    dispatch({
      type: "set-fit-bbox",
      bbox: collectionBbox,
    });
  }, [collections, dispatch]);

  useEffect(() => {
    setFilteredCollections(
      filterCollections(collections, bounds, includeGlobalCollections)
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
}: {
  catalog: StacCatalog;
  collections?: StacCollection[];
  setHref: Dispatch<SetStateAction<string>>;
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
        <Collections collections={collections} setHref={setHref}></Collections>
      )}
    </Stack>
  );
}
