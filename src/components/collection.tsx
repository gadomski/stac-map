import { DataList, Text } from "@chakra-ui/react";
import { LuFolderPlus } from "react-icons/lu";
import type {
  StacCollection,
  SpatialExtent as StacSpatialExtent,
  TemporalExtent as StacTemporalExtent,
} from "stac-ts";
import { ValueInfo } from "./value";

export default function Collection({
  collection,
}: {
  collection: StacCollection;
}) {
  return (
    <ValueInfo value={collection} icon={<LuFolderPlus></LuFolderPlus>}>
      <CollectionInfo collection={collection}></CollectionInfo>
    </ValueInfo>
  );
}

function CollectionInfo({ collection }: { collection: StacCollection }) {
  return (
    <DataList.Root orientation={"horizontal"} size={"sm"} py={4}>
      {collection.extent?.spatial?.bbox?.[0] && (
        <DataList.Item>
          <DataList.ItemLabel>Spatial extent</DataList.ItemLabel>
          <DataList.ItemValue>
            <SpatialExtent
              bbox={collection.extent.spatial.bbox[0]}
            ></SpatialExtent>
          </DataList.ItemValue>
        </DataList.Item>
      )}
      {collection.extent?.temporal?.interval?.[0] && (
        <DataList.Item>
          <DataList.ItemLabel>Temporal extent</DataList.ItemLabel>
          <DataList.ItemValue>
            <TemporalExtent
              interval={collection.extent.temporal.interval[0]}
            ></TemporalExtent>
          </DataList.ItemValue>
        </DataList.Item>
      )}
    </DataList.Root>
  );
}

function SpatialExtent({ bbox }: { bbox: StacSpatialExtent }) {
  return <Text>[{bbox.map((n) => Number(n.toFixed(4))).join(", ")}]</Text>;
}

function TemporalExtent({ interval }: { interval: StacTemporalExtent }) {
  return (
    <Text>
      <DateString datetime={interval[0]}></DateString> —{" "}
      <DateString datetime={interval[1]}></DateString>
    </Text>
  );
}

function DateString({ datetime }: { datetime: string | null }) {
  if (datetime) {
    return new Date(datetime).toLocaleDateString();
  } else {
    return "unbounded";
  }
}
