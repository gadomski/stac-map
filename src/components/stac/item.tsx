import { Stack } from "@chakra-ui/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useEffect } from "react";
import { LuFile } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { useLayersDispatch } from "../map/context";
import { ValueInfo } from "./shared";

export function Item({ item }: { item: StacItem }) {
  const dispatch = useLayersDispatch();

  useEffect(() => {
    if (item.geometry) {
      const layer = new GeoJsonLayer({
        id: "stac-item",
        // @ts-expect-error Don't want to bother getting typing correct
        data: item,
        stroked: true,
        filled: true,
        getFillColor: [207, 63, 2, 100],
      });
      dispatch({ type: "set-layers", layers: [layer], bbox: item.bbox });
    }
  }, [item]);

  return (
    <Stack>
      <ValueInfo
        type={"Item"}
        id={item.id}
        icon={<LuFile></LuFile>}
      ></ValueInfo>
    </Stack>
  );
}
