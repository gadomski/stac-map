import { Stack } from "@chakra-ui/react";
import { LuFile } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { ValueInfo } from "./shared";

export function Item({ item }: { item: StacItem }) {
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
