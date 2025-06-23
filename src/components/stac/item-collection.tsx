import { Stack } from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { ValueInfo } from "./shared";
import type { StacItemCollection } from "./types";

export function ItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  return (
    <Stack>
      <ValueInfo
        type={"Item collection"}
        value={itemCollection}
        id={itemCollection.id || "no id"}
        icon={<LuFiles></LuFiles>}
      ></ValueInfo>
    </Stack>
  );
}
