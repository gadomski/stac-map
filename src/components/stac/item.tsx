import { SimpleGrid } from "@chakra-ui/react";
import type { StacItem } from "stac-ts";
import { AssetCard } from "./asset";

export default function Item({ item }: { item: StacItem }) {
  return (
    <SimpleGrid columns={2} gap={2} my={2}>
      {Object.entries(item.assets).map(([key, asset]) => (
        <AssetCard key={item.id + key} assetKey={key} asset={asset}></AssetCard>
      ))}
    </SimpleGrid>
  );
}
