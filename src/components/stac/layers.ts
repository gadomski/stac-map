import { GeoJsonLayer } from "@deck.gl/layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { BBox } from "geojson";
import type { StacCatalog, StacCollection, StacItem } from "stac-ts";
import type { StacItemCollection } from "./types";
import { sanitizeBbox } from "./utils";

export function getCatalogLayers(
  catalog: StacCatalog,
  collections: StacCollection[],
) {
  return [
    new GeoJsonLayer({
      id: `catalog-${catalog.id}`,
      data: collections.map((collection) =>
        bboxPolygon(sanitizeBbox(collection.extent.spatial.bbox[0]) as BBox),
      ),
      stroked: true,
      filled: false,
      getLineColor: [207, 63, 2],
      lineWidthUnits: "pixels",
    }),
  ];
}

export function getCollectionLayers(collection: StacCollection) {
  const bbox = sanitizeBbox(collection.extent.spatial.bbox[0]);
  const polygon = bboxPolygon(bbox as BBox);
  return [
    new GeoJsonLayer({
      id: "collection",
      data: polygon,
      stroked: false,
      filled: true,
      getFillColor: [207, 63, 2, 100],
    }),
  ];
}

export function getItemLayers(item: StacItem) {
  return [];
}
export function getItemCollectionLayers(itemCollection: StacItemCollection) {
  return [];
}
