import { Text } from "@chakra-ui/react";
import { type Dispatch, type SetStateAction } from "react";
import { Catalog } from "./catalog";
import { Collection } from "./collection";
import { Item } from "./item";
import { ItemCollection } from "./item-collection";
import type { StacValue } from "./types";

export function Value({
  value,
  setHref,
  stacGeoparquetPath,
}: {
  value: StacValue;
  setHref: Dispatch<SetStateAction<string>>;
  stacGeoparquetPath?: string;
}) {
  switch (value.type) {
    case "Catalog":
      return <Catalog catalog={value} setHref={setHref}></Catalog>;
    case "Collection":
      return <Collection collection={value}></Collection>;
    case "Feature":
      return <Item item={value}></Item>;
    case "FeatureCollection":
      return (
        <ItemCollection
          itemCollection={value}
          stacGeoparquetPath={stacGeoparquetPath}
        ></ItemCollection>
      );
    default:
      // TODO make this better
      return (
        <Text color={"red"}>
          Could not parse STAC value with type
          {
            // @ts-expect-error Fallback
            value.type
          }
        </Text>
      );
  }
}
