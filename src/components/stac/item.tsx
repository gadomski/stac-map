import { SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import type { StacItem } from "stac-ts";
import { useFitBbox, useLayersDispatch } from "../../hooks";
import { AssetCard } from "./asset";
import { getItemLayer } from "./layers";
import { sanitizeBbox } from "./utils";

export default function Item({ item }: { item: StacItem }) {
  const dispatch = useLayersDispatch();
  const fitBbox = useFitBbox();

  useEffect(() => {
    if (item.geometry) {
      dispatch({ type: "set-value", layer: getItemLayer(item) });
    } else {
      dispatch({ type: "set-value", layer: null });
    }
    dispatch({ type: "set-selected", layer: null });
  }, [item, dispatch]);

  useEffect(() => {
    if (item.bbox) {
      fitBbox(sanitizeBbox(item.bbox));
    }
  }, [item, fitBbox]);

  return (
    <SimpleGrid columns={2} gap={2} my={2}>
      {Object.entries(item.assets).map(([key, asset]) => (
        <AssetCard key={item.id + key} assetKey={key} asset={asset}></AssetCard>
      ))}
    </SimpleGrid>
  );
}
