import { DataList } from "@chakra-ui/react";
import type { StacCollection, StacLink } from "stac-ts";
import { InfoTip } from "../ui/toggle-tip";

export default function Search({
  collections,
  links,
}: {
  collections: StacCollection[];
  links: StacLink[];
}) {
  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.ItemLabel>
          Bounding box
          <InfoTip content="Defined by the map bounds"></InfoTip>
        </DataList.ItemLabel>
        <DataList.ItemValue></DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
