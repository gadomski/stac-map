import { Stack } from "@chakra-ui/react";
import { LuFolderPlus } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { ValueInfo } from "./shared";

export function Collection({ collection }: { collection: StacCollection }) {
  return (
    <Stack>
      <ValueInfo
        type={"Collection"}
        value={collection}
        id={collection.id}
        icon={<LuFolderPlus></LuFolderPlus>}
        title={collection.title}
        description={collection.description}
      ></ValueInfo>
    </Stack>
  );
}
