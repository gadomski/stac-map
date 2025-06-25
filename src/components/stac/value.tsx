import { Text } from "@chakra-ui/react";
import { type Dispatch, type SetStateAction } from "react";
import type { StacCollection } from "stac-ts";
import { Catalog } from "./catalog";
import { Collection } from "./collection";
import { Item } from "./item";
import { ItemCollection } from "./item-collection";
import type { StacValue } from "./types";

export function Value({
  value,
  collections,
  setHref,
  stacGeoparquetPath,
  setPicked,
}: {
  value: StacValue;
  collections?: StacCollection[];
  setHref: Dispatch<SetStateAction<string>>;
  stacGeoparquetPath?: string;
  setPicked?: Dispatch<SetStateAction<StacValue | undefined>>;
}) {
  switch (value.type) {
    case "Catalog":
      return (
        <Catalog
          catalog={value}
          collections={collections}
          setHref={setHref}
        ></Catalog>
      );
    case "Collection":
      return <Collection collection={value}></Collection>;
    case "Feature":
      return <Item item={value}></Item>;
    case "FeatureCollection":
      return (
        <ItemCollection
          itemCollection={value}
          stacGeoparquetPath={stacGeoparquetPath}
          setPicked={setPicked}
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
