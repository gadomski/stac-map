import type { StacValue } from "./types";

export function getBbox(value: StacValue) {
  switch (value.type) {
    case "Collection":
      return sanitizeBbox(value.extent.spatial.bbox[0]);
    case "Feature":
      return (value.bbox && sanitizeBbox(value.bbox)) || null;
    default:
      // TODO item collection
      return null;
  }
}

export function sanitizeBbox(bbox: number[]) {
  const newBbox = (bbox.length == 6 && [
    bbox[0],
    bbox[1],
    bbox[3],
    bbox[4],
  ]) || [bbox[0], bbox[1], bbox[2], bbox[3]];
  if (bbox[0] < -180) {
    bbox[0] = -180;
  }
  if (bbox[1] < -90) {
    bbox[1] = -90;
  }
  if (bbox[2] > 180) {
    bbox[2] = 180;
  }
  if (bbox[3] > 90) {
    bbox[3] = 90;
  }
  return newBbox as [number, number, number, number];
}
