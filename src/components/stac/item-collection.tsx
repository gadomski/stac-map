import { Text } from "@chakra-ui/react";
import type { StacItemCollection } from "./types";

export default function ItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  if (itemCollection.features.length > 0) {
    return (
      <Text>
        {itemCollection.features.length} item
        {itemCollection.features.length > 1 && "s"}
      </Text>
    );
  }
}
