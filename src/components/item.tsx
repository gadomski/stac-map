import { Stack } from "@chakra-ui/react";
import { LuFile } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import Assets from "./assets";
import { ValueInfo } from "./value";

export default function Item({ item }: { item: StacItem }) {
  return (
    <Stack gap={4}>
      <ValueInfo value={item} type="Item" icon={<LuFile></LuFile>}></ValueInfo>
      <Assets assets={item.assets}></Assets>
    </Stack>
  );
}
