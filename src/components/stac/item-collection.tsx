import { DataList, Stack } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { LuFiles } from "react-icons/lu";
import { useMapDispatch } from "../map/context";
import { ValueInfo } from "./shared";
import StacGeoparquet from "./stac-geoparquet";
import type { StacItemCollection, StacValue } from "./types";

export function ItemCollection({
  itemCollection,
  stacGeoparquetPath,
  setPicked,
  setLayers,
}: {
  itemCollection: StacItemCollection;
  stacGeoparquetPath?: string;
  setPicked?: Dispatch<SetStateAction<StacValue | undefined>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  return (
    <Stack>
      <ValueInfo
        type={"Item collection"}
        value={itemCollection}
        id={itemCollection.id || "no id"}
        title={itemCollection.title}
        description={itemCollection.description}
        icon={<LuFiles></LuFiles>}
        hideJsonButton={stacGeoparquetPath !== undefined}
      ></ValueInfo>
      {(stacGeoparquetPath && (
        <StacGeoparquet
          path={stacGeoparquetPath}
          setPicked={setPicked}
          setLayers={setLayers}
        ></StacGeoparquet>
      )) || (
        <JsonItemCollection
          itemCollection={itemCollection}
          setPicked={setPicked}
          setLayers={setLayers}
        ></JsonItemCollection>
      )}
    </Stack>
  );
}

function JsonItemCollection({
  itemCollection,
  setPicked,
  setLayers,
}: {
  itemCollection: StacItemCollection;
  setPicked?: Dispatch<SetStateAction<StacValue | undefined>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const dispatch = useMapDispatch();

  useEffect(() => {
    if (itemCollection.features.length > 0) {
      const layer = new GeoJsonLayer({
        id: "stac-item-collection",
        // @ts-expect-error Don't want to bother getting typing correct
        data: itemCollection,
        stroked: true,
        filled: true,
        getFillColor: [207, 63, 2, 100],
        pickable: true,
        onClick: (e) => e.object && setPicked && setPicked(e.object),
      });
      setLayers([layer]);
    }
  }, [itemCollection, dispatch, setPicked, setLayers]);

  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.ItemLabel>Number of items</DataList.ItemLabel>
        <DataList.ItemValue>
          {itemCollection.features.length}
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
