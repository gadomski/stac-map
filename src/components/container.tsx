import { DataList, Stack } from "@chakra-ui/react";
import type { StacContainer, StacItemCollection } from "./stac/context";

function ItemCollectionDataListItems({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  return (
    <>
      <DataList.Item>
        <DataList.ItemLabel>Number of items</DataList.ItemLabel>
        <DataList.ItemValue>{itemCollection.count}</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>Start datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {itemCollection.startDatetime.toLocaleString()}
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>End datetime</DataList.ItemLabel>
        <DataList.ItemValue>
          {itemCollection.endDatetime.toLocaleString()}
        </DataList.ItemValue>
      </DataList.Item>
    </>
  );
}

export default function Container({ container }: { container: StacContainer }) {
  return (
    <Stack>
      <DataList.Root orientation={"horizontal"}>
        {container.id && (
          <DataList.Item>
            <DataList.ItemLabel>ID</DataList.ItemLabel>
            <DataList.ItemValue>{container.id}</DataList.ItemValue>
          </DataList.Item>
        )}
        <DataList.Item>
          <DataList.ItemLabel>Type</DataList.ItemLabel>
          <DataList.ItemValue>{container.type}</DataList.ItemValue>
        </DataList.Item>
        {container.title && (
          <DataList.Item>
            <DataList.ItemLabel>Title</DataList.ItemLabel>
            <DataList.ItemValue>{container.title}</DataList.ItemValue>
          </DataList.Item>
        )}
        {container.description && (
          <DataList.Item>
            <DataList.ItemLabel>Description</DataList.ItemLabel>
            <DataList.ItemValue>{container.description}</DataList.ItemValue>
          </DataList.Item>
        )}
        {container.type == "FeatureCollection" && (
          <ItemCollectionDataListItems
            itemCollection={container}
          ></ItemCollectionDataListItems>
        )}
      </DataList.Root>
    </Stack>
  );
}
