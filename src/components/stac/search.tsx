import {
  Badge,
  createListCollection,
  DataList,
  Portal,
  Select,
} from "@chakra-ui/react";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useState } from "react";
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
  const [filteredCollections, setFilteredCollections] = useState(collections);

  useEffect(() => {
    if (bounds) {
      setFilteredCollections(
        collections.filter((collection) =>
          isCollectionWithinBounds(collection, bounds)
        )
      );
    }
  }, [collections, setFilteredCollections, bounds]);

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
      <DataList.Item>
        <DataList.ItemLabel>
          Collections <Badge>{filteredCollections.length}</Badge>
          <InfoTip content="Filtered to viewport"></InfoTip>
        </DataList.ItemLabel>
        <DataList.ItemValue>
          <CollectionsSelect
            collections={filteredCollections}
          ></CollectionsSelect>
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

function CollectionsSelect({ collections }: { collections: StacCollection[] }) {
  const collection = createListCollection({
    items: collections,
    itemToString: (collection) => collection.title || collection.id,
    itemToValue: (collection) => collection.id,
  });
  return (
    <Select.Root multiple collection={collection}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select collection(s)" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((collection) => (
              <Select.Item item={collection} key={collection.id}>
                {collection.title || collection.id}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

function isCollectionWithinBounds(
  collection: StacCollection,
  bounds: LngLatBounds
) {
  const bbox = collection.extent.spatial.bbox[0];
  let collectionBounds;
  if (bbox.length == 4) {
    collectionBounds = [bbox[0], bbox[1], bbox[2], bbox[3]];
  } else {
    // assume 6
    collectionBounds = [bbox[0], bbox[1], bbox[3], bbox[4]];
  }
  return (
    collectionBounds[0] <= bounds.getEast() &&
    collectionBounds[2] >= bounds.getWest() &&
    collectionBounds[1] <= bounds.getNorth() &&
    collectionBounds[3] >= bounds.getSouth()
  );
}
