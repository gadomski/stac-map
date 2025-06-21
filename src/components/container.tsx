import { DataList, Stack } from "@chakra-ui/react";
import type { StacContainer } from "./stac/context";

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
      </DataList.Root>
    </Stack>
  );
}
