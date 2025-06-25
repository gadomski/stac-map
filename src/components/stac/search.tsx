import {
  Badge,
  createListCollection,
  DataList,
  Portal,
  Select,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  useEffect(() => {
    if (bounds) {
      setFilteredCollections(
        collections.filter((collection) =>
          isCollectionWithinBounds(collection, bounds)
        )
      );
    } else {
      setFilteredCollections(collections);
    }
  }, [collections, setFilteredCollections, bounds]);

  console.log(selectedCollections);

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
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            collections={filteredCollections}
          ></CollectionsSelect>
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

function CollectionsSelect({
  collections,
  selectedCollections,
  setSelectedCollections,
}: {
  collections: StacCollection[];
  selectedCollections: string[];
  setSelectedCollections: Dispatch<SetStateAction<string[]>>;
}) {
  const collection = createListCollection({
    items: collections,
    itemToString: (collection) => collection.title || collection.id,
    itemToValue: (collection) => collection.id,
  });

  function onSelect(e: MenuSelectionDetails) {
    if (selectedCollections.includes(e.value)) {
      setSelectedCollections(selectedCollections.filter((s) => s != e.value));
    } else {
      setSelectedCollections([...selectedCollections, e.value]);
    }
  }

  return (
    <Select.Root
      multiple
      collection={collection}
      onSelect={onSelect}
      value={selectedCollections}
    >
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
