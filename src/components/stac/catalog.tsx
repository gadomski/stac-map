import {
  Badge,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { BBox } from "geojson";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuFolder } from "react-icons/lu";
import type { StacCatalog, StacCollection, StacLink } from "stac-ts";
import { useLayersDispatch } from "../map/context";
import { CollectionCard } from "./collection";
import { ValueInfo } from "./shared";
import { sanitizeBbox } from "./utils";

function Collections({
  href,
  setHref,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const { collections, loading, error } = useCollections(href);
  const dispatch = useLayersDispatch();

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
      type: "set-layers",
      layers: [polygonLayer],
      bbox: collectionBbox,
    });
  }, [collections, dispatch]);

  if (error) {
    return <Text color={"red"}>Error when loading collections: {error}</Text>;
  } else if (loading) {
    return <Skeleton h={200}></Skeleton>;
  } else {
    return (
      <Stack>
        <HStack mt={8}>
          <Heading size={"md"}>Collections</Heading>{" "}
          <Badge>{collections.length}</Badge>
        </HStack>
        {collections.map((collection) => (
          <CollectionCard
            collection={collection}
            setHref={setHref}
            key={collection.id}
          ></CollectionCard>
        ))}
      </Stack>
    );
  }
}

export function Catalog({
  catalog,
  setHref,
}: {
  catalog: StacCatalog;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const collectionsHref = catalog.links.find(
    (link) => link.rel == "data"
  )?.href;
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

      {collectionsHref && (
        <Collections href={collectionsHref} setHref={setHref}></Collections>
      )}
    </Stack>
  );
}

function useCollections(href: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [collections, setCollections] = useState<StacCollection[]>([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let nextHref = href;
      let fetchedCollections: StacCollection[] = [];
      while (true) {
        const response = await fetch(nextHref);
        if (response.ok) {
          const data = await response.json();
          fetchedCollections = [
            ...fetchedCollections,
            ...(data.collections ?? []),
          ];
          const nextLink = (data.links ?? []).find(
            (link: StacLink) => link.rel == "next"
          );
          if (nextLink && nextLink.href != nextHref) {
            nextHref = nextLink.href;
          } else {
            break;
          }
        } else {
          setError(
            "Error while fetching " + href + ": " + (await response.text())
          );
          break;
        }
      }
      setCollections(fetchedCollections);
      setLoading(false);
    })();
  }, [href]);

  return { collections, loading, error };
}
