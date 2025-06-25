import type { LngLatBounds } from "maplibre-gl";
import type { StacCollection } from "stac-ts";
import type { StacValue } from "./types";

export function getSelfHref(value: StacValue) {
  return value.links?.find((link) => link.rel == "self")?.href;
}

export function sanitizeBbox(bbox: number[]) {
  if (bbox[0] < -180) {
    bbox[0] = -180;
  }
  if (bbox[1] < -90) {
    bbox[1] = -90;
  }
  const [i0, i1] = bbox.length == 6 ? [3, 4] : [2, 3];
  if (bbox[i0] > 180) {
    bbox[i0] = 180;
  }
  if (bbox[i1] > 90) {
    bbox[i1] = 90;
  }
  return bbox;
}

export function isUrl(href: string) {
  try {
    new URL(href);
  } catch {
    return false;
  }
  return true;
}

export function filterCollections(
  collections: StacCollection[],
  bounds: LngLatBounds | undefined,
  includeGlobalCollections: boolean
) {
  if (bounds) {
    return collections.filter(
      (collection) =>
        isCollectionWithinBounds(collection, bounds) &&
        (includeGlobalCollections || !isGlobalCollection(collection))
    );
  } else {
    return collections.filter(
      (collection) =>
        includeGlobalCollections || !isGlobalCollection(collection)
    );
  }
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

function isGlobalCollection(collection: StacCollection) {
  // We don't check the poles because a lot of "global" products don't go all the way up/down there
  // TODO do we want to check w/i some tolerances?
  const bbox = collection.extent.spatial.bbox[0];
  if (bbox.length == 4) {
    return bbox[0] == -180 && bbox[2] == 180;
  } else {
    // Assume length 6
    return bbox[0] == -180 && bbox[3] == 180;
  }
}
