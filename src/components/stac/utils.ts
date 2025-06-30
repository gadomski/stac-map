import { LngLatBounds } from "maplibre-gl";
import type { StacCollection } from "stac-ts";
import type { StacItemCollection } from "./types";

export function sanitizeBbox(bbox: number[]) {
  const newBbox = (bbox.length == 6 && [
    bbox[0],
    bbox[1],
    bbox[3],
    bbox[4],
  ]) || [bbox[0], bbox[1], bbox[2], bbox[3]];
  if (newBbox[0] < -180) {
    newBbox[0] = -180;
  }
  if (newBbox[1] < -90) {
    newBbox[1] = -90;
  }
  if (newBbox[2] > 180) {
    newBbox[2] = 180;
  }
  if (newBbox[3] > 90) {
    newBbox[3] = 90;
  }
  return newBbox as [number, number, number, number];
}

export function isCollectionWithinBounds(
  collection: StacCollection,
  bounds: LngLatBounds,
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
    collectionBounds[3] >= bounds.getSouth() &&
    (collectionBounds[0] >= bounds.getWest() ||
      collectionBounds[1] >= bounds.getSouth() ||
      collectionBounds[2] <= bounds.getEast() ||
      collectionBounds[3] <= bounds.getNorth())
  );
}

export function getCollectionsExtent(collections: StacCollection[]) {
  if (collections.length == 0) {
    return [-180, -90, 180, 90];
  }
  const bbox = [180, 90, -180, -90];
  collections.forEach((collection) => {
    const sanitizedBbox = sanitizeBbox(collection.extent.spatial.bbox[0]);
    if (sanitizedBbox[0] < bbox[0]) {
      bbox[0] = sanitizedBbox[0];
    }
    if (sanitizedBbox[1] < bbox[1]) {
      bbox[1] = sanitizedBbox[1];
    }
    if (sanitizedBbox[2] > bbox[2]) {
      bbox[2] = sanitizedBbox[2];
    }
    if (sanitizedBbox[3] > bbox[3]) {
      bbox[3] = sanitizedBbox[3];
    }
  });
  return bbox;
}

export function getItemCollectionExtent(itemCollection: StacItemCollection) {
  const bbox = [180, 90, -180, -90];
  let seen = false;
  itemCollection.features.forEach((item) => {
    if (item.bbox) {
      seen = true;
      const sanitizedBbox = sanitizeBbox(item.bbox);
      if (sanitizedBbox[0] < bbox[0]) {
        bbox[0] = sanitizedBbox[0];
      }
      if (sanitizedBbox[1] < bbox[1]) {
        bbox[1] = sanitizedBbox[1];
      }
      if (sanitizedBbox[2] > bbox[2]) {
        bbox[2] = sanitizedBbox[2];
      }
      if (sanitizedBbox[3] > bbox[3]) {
        bbox[3] = sanitizedBbox[3];
      }
    }
  });
  if (seen) {
    return bbox;
  } else {
    return [-180, -90, 180, 90];
  }
}
