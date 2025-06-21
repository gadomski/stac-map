import { DataList } from "@chakra-ui/react";
import type { StacGeoparquetMetadata } from "./stac-geoparquet/context";

export default function Metadata({
  metadata,
}: {
  metadata: StacGeoparquetMetadata;
}) {
  return (
    <DataList.Root orientation={"horizontal"} size={"sm"}>
      <DataList.Item>
        <DataList.ItemLabel>Count</DataList.ItemLabel>
        <DataList.ItemValue>{metadata.count}</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Start datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {metadata.startDatetime.toLocaleDateString()}
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>End datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {metadata.endDatetime.toLocaleDateString()}
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
