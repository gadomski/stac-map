import { DataList, Link, List, Stack } from "@chakra-ui/react";
import type { StacLink } from "stac-ts";
import type { StacContainer, StacItemCollection } from "./stac/context";
import { useStacDispatch } from "./stac/hooks";

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

function Children({ children }: { children: StacLink[] }) {
  const dispatch = useStacDispatch();

  return (
    <>
      <List.Root variant={"plain"} fontSize={"sm"}>
        {children.map((child) => (
          <List.Item key={child.href}>
            <Link
              onClick={() => {
                dispatch({
                  type: "set-path",
                  path: child.href,
                  title: child.title,
                });
              }}
            >
              {child.title || child.href}
            </Link>
          </List.Item>
        ))}
      </List.Root>
    </>
  );
}

export default function Container({ container }: { container: StacContainer }) {
  const children = container.links?.filter((link) => link.rel == "child");
  const parent = container.links?.find((link) => link.rel == "parent");
  const dispatch = useStacDispatch();
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
        {container.stac_version && (
          <DataList.Item>
            <DataList.ItemLabel>STAC version</DataList.ItemLabel>
            <DataList.ItemValue>{container.stac_version}</DataList.ItemValue>
          </DataList.Item>
        )}
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
        {parent && (
          <DataList.Item>
            <DataList.ItemLabel>Parent</DataList.ItemLabel>
            <DataList.ItemValue>
              <Link
                onClick={() =>
                  dispatch({
                    type: "set-path",
                    path: parent.href,
                    title: parent.title,
                  })
                }
              >
                {parent.title || parent.href}
              </Link>
            </DataList.ItemValue>
          </DataList.Item>
        )}
        {children && children.length > 0 && (
          <DataList.Item>
            <DataList.ItemLabel>Children</DataList.ItemLabel>
            <DataList.ItemValue>
              <Children children={children}></Children>
            </DataList.ItemValue>
          </DataList.Item>
        )}
      </DataList.Root>
    </Stack>
  );
}
