import {
  Card,
  DataList,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import bboxPolygon from "@turf/bbox-polygon";
import type { BBox } from "geojson";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { LuFolderPlus, LuUpload, LuZoomIn } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { RawJsonDialogButton } from "../json";
import { useMapDispatch } from "../map/context";
import { Tooltip } from "../ui/tooltip";
import { AssetCard } from "./asset";
import { ValueInfo } from "./shared";
import { getSelfHref, sanitizeBbox } from "./utils";

export function Collection({
  collection,
  setLayers,
}: {
  collection: StacCollection;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const dispatch = useMapDispatch();

  useEffect(() => {
    const bbox = sanitizeBbox(collection.extent.spatial.bbox[0]);
    const polygon = bboxPolygon(bbox as BBox);
    const layer = new GeoJsonLayer({
      id: "collection",
      data: polygon,
      stroked: false,
      filled: true,
      getFillColor: [207, 63, 2, 100],
    });
    setLayers([layer]);
    dispatch({ type: "set-fit-bbox", bbox: bbox });
  }, [collection, dispatch, setLayers]);

  return (
    <Stack gap={4}>
      <ValueInfo
        type={"Collection"}
        value={collection}
        id={collection.id}
        icon={<LuFolderPlus></LuFolderPlus>}
        title={collection.title}
        description={collection.description}
      ></ValueInfo>

      {collection.assets && (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
          {Object.entries(collection.assets).map(([key, asset]) => (
            <AssetCard
              asset={asset}
              assetKey={key}
              key={collection.id + key}
            ></AssetCard>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}

export function CollectionCard({
  collection,
  setHref,
}: {
  collection: StacCollection;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const selfHref = getSelfHref(collection);
  const dispatch = useMapDispatch();
  const thumbnail = Object.values(collection.assets || {}).find((asset) =>
    asset.roles?.includes("thumbnail")
  );

  return (
    <Card.Root size={"sm"}>
      <Card.Header>
        <Text fontSize={"xs"}>{collection.title || collection.id}</Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {thumbnail && <Image src={thumbnail.href}></Image>}
          <Text lineClamp={3}>{collection.description}</Text>
          <DataList.Root>
            <DataList.Item>
              <DataList.ItemLabel>Bounding box</DataList.ItemLabel>
              <DataList.ItemValue>
                {collection.extent.spatial.bbox[0]
                  .map((n) => Number(n.toFixed(4)))
                  .join(", ")}
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Card.Footer>
          <Stack>
            <HStack>
              {selfHref && (
                <Tooltip content="Load collection">
                  <IconButton
                    variant={"surface"}
                    size={"xs"}
                    onClick={() => setHref(selfHref)}
                  >
                    <LuUpload></LuUpload>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip content="Zoom to collection">
                <IconButton
                  variant={"surface"}
                  size={"xs"}
                  onClick={() =>
                    dispatch({
                      type: "set-fit-bbox",
                      bbox: collection.extent.spatial.bbox[0],
                    })
                  }
                >
                  <LuZoomIn></LuZoomIn>
                </IconButton>
              </Tooltip>
              <Tooltip content="View raw JSON">
                <RawJsonDialogButton
                  title={collection.id}
                  value={collection}
                  variant={"surface"}
                  size={"xs"}
                ></RawJsonDialogButton>
              </Tooltip>
            </HStack>
          </Stack>
        </Card.Footer>
      </Card.Footer>
    </Card.Root>
  );
}
