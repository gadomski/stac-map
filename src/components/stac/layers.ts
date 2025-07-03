import { Layer } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { GeoArrowPolygonLayerProps } from "@geoarrow/deck.gl-layers";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { Table } from "apache-arrow";
import type { BBox } from "geojson";
import { useEffect, useState } from "react";
import type { StacCollection, StacItem } from "stac-ts";
import { useAppDispatch } from "../../hooks";
import { getStacGeoparquetItem, useDuckDbConnection } from "./stac-geoparquet";
import type { StacItemCollection } from "./types";
import { sanitizeBbox } from "./utils";

export function getCollectionsLayer(
  collections: StacCollection[],
  filled: boolean,
) {
  const validCollections = collections.filter(
    (collection) => collection.extent?.spatial?.bbox?.[0],
  );

  return new GeoJsonLayer({
    data: validCollections.map((collection) =>
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
  if (!collection.extent?.spatial?.bbox?.[0]) {
    return null;
  }

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

export function getItemCollectionLayer(itemCollection: StacItemCollection) {
  return new GeoJsonLayer({
    // @ts-expect-error Don't want to bother typing correctly
    data: itemCollection,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [207, 63, 2, 100],
    getFillColor: [207, 63, 2, 50],
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

export function useStacGeoparquetLayer(table: Table, path: string) {
  const { connection, duckDbError } = useDuckDbConnection();
  const [layer, setLayer] = useState<Layer | undefined>();
  const [item, setItem] = useState<StacItem | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (duckDbError) {
      setError(`DuckDb error: ${duckDbError}`);
    }
  }, [duckDbError]);

  useEffect(() => {
    (async () => {
      if (connection && id) {
        try {
          const item = await getStacGeoparquetItem(id, path, connection);
          setItem(item);
          // eslint-disable-next-line
        } catch (error: any) {
          setError(error.toString());
        }
      }
    })();
  }, [connection, id, dispatch, path]);

  useEffect(() => {
    const props: Omit<GeoArrowPolygonLayerProps, "id"> = {
      data: table,
      stroked: true,
      filled: true,
      getFillColor: [207, 63, 2, 50],
      getLineColor: [207, 63, 2, 100],
      lineWidthUnits: "pixels",
      autoHighlight: true,
      pickable: true,
      onClick: (info) => {
        setId(table.getChild("id")?.get(info.index));
      },
    };
    setLayer(new GeoArrowPolygonLayer(props));
  }, [table]);

  return {
    layer,
    item,
    error,
  };
}
