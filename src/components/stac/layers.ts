import { Layer } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { BBox } from "geojson";
import type { Dispatch } from "react";
import type { StacCatalog, StacCollection, StacItem } from "stac-ts";
import type { AppStateAction } from "../context";
import type { StacItemCollection, StacValue } from "./types";
import { sanitizeBbox } from "./utils";

export function getStacLayers(
  value: StacValue,
  collections: StacCollection[] | undefined,
  dispatch: Dispatch<AppStateAction> | undefined,
): Layer[] {
  switch (value.type) {
    case "Catalog":
      if (collections) {
        return getCatalogLayers(value, collections);
      } else {
        return [];
      }
    case "Collection":
      return getCollectionLayers(value);
    case "Feature":
      return getItemLayers(value);
    case "FeatureCollection":
      return getItemCollectionLayers(value, dispatch);
    default:
      return [];
  }
}

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
      id: `collection-${collection.id}`,
      data: polygon,
      stroked: false,
      filled: true,
      getFillColor: [207, 63, 2, 100],
    }),
  ];
}

export function getItemLayers(item: StacItem) {
  return [
    new GeoJsonLayer({
      id: `item-${item.id}`,
      // @ts-expect-error Don't want to bother typing this one.
      data: item,
      filled: true,
      getFillColor: [207, 63, 2, 100],
    }),
  ];
}

export function getItemCollectionLayers(
  itemCollection: StacItemCollection,
  dispatch: Dispatch<AppStateAction> | undefined,
) {
  return [
    new GeoJsonLayer({
      id: `item-collection`,
      // @ts-expect-error Don't want to bother typing this one.
      data: itemCollection,
      stroked: true,
      filled: true,
      pickable: true,
      onClick: (info) => {
        if (dispatch) {
          dispatch({ type: "pick", value: info.object });
        }
      },
      getLineColor: [207, 63, 2, 100],
      getFillColor: [207, 63, 2, 50],
      lineWidthUnits: "pixels",
    }),
  ];
}
