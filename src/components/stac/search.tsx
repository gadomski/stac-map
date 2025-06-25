import { DataList } from "@chakra-ui/react";
import type { StacCollection, StacLink } from "stac-ts";
import { useMap } from "../map/context";
import { InfoTip } from "../ui/toggle-tip";

export default function Search({
  collections,
  links,
}: {
  collections: StacCollection[];
  links: StacLink[];
}) {
  const { bounds } = useMap();

  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.ItemLabel>
          Bounding box
          <InfoTip content="Defined by the map bounds"></InfoTip>
        </DataList.ItemLabel>
        <DataList.ItemValue>
          {bounds
            ?.toArray()
            .flat()
            .map((n) => Number(n.toFixed(4)))
            .join(", ")}
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
