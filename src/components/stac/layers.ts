import { GeoJsonLayer } from "@deck.gl/layers";
import type { GeoArrowPolygonLayerProps } from "@geoarrow/deck.gl-layers";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { Table } from "apache-arrow";
import type { BBox } from "geojson";
import type { Dispatch } from "react";
import type { StacCollection, StacItem } from "stac-ts";
import type { SelectedAction } from "../../context";
import type { StacItemCollection } from "./types";
import { sanitizeBbox } from "./utils";

export function getCollectionsLayer(
  collections: StacCollection[],
  filled: boolean,
) {
  return new GeoJsonLayer({
    data: collections.map((collection) =>
      bboxPolygon(sanitizeBbox(collection.extent.spatial.bbox[0]) as BBox),
    ),
    stroked: true,
    filled,
    getLineColor: [207, 63, 2, 100],
    getFillColor: [207, 63, 2, 50],
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

export function getCollectionLayer(collection: StacCollection) {
  return new GeoJsonLayer({
    data: bboxPolygon(sanitizeBbox(collection.extent.spatial.bbox[0]) as BBox),
    stroked: true,
    filled: true,
    getLineColor: [207, 63, 2, 100],
    getFillColor: [207, 63, 2, 50],
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

export function getItemLayer(item: StacItem) {
  return new GeoJsonLayer({
    // @ts-expect-error Don't want to bother typing correctly
    data: item,
    stroked: true,
    filled: true,
    getLineColor: [207, 63, 2, 100],
    getFillColor: [207, 63, 2, 50],
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

export function getItemCollectionLayer(
  itemCollection: StacItemCollection,
  dispatch?: Dispatch<SelectedAction>,
) {
  return new GeoJsonLayer({
    // @ts-expect-error Don't want to bother typing correctly
    data: itemCollection,
    stroked: true,
    filled: true,
    pickable: true,
    onClick: (info) => {
      if (dispatch) {
        dispatch({ type: "select-item", item: info.object });
      }
    },
    getLineColor: [207, 63, 2, 100],
    getFillColor: [207, 63, 2, 50],
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

export function getStacGeoparquetLayer(
  table: Table,
  dispatch?: Dispatch<SelectedAction>,
) {
  const props: Omit<GeoArrowPolygonLayerProps, "id"> = {
    data: table,
    stroked: true,
    filled: true,
    getFillColor: [207, 63, 2, 50],
    getLineColor: [207, 63, 2, 100],
    lineWidthUnits: "pixels",
    autoHighlight: true,
  };
  if (dispatch) {
    props.pickable = true;
    props.onClick = (info) => {
      const id = table.getChild("id")?.get(info.index);
      dispatch({ type: "select-stac-geoparquet-id", id });
    };
  }
  return new GeoArrowPolygonLayer(props);
}
