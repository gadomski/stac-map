import { Layer, type DeckProps } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { bboxPolygon } from "@turf/bbox-polygon";
import type { Table } from "apache-arrow";
import type { BBox } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import {
  Map as MaplibreMap,
  useControl,
  type MapRef,
} from "react-map-gl/maplibre";
import type { StacCollection, StacItem } from "stac-ts";
import type { StacValue } from "./components/stac/types";
import {
  getCollectionsExtent,
  getItemCollectionExtent,
  sanitizeBbox,
} from "./components/stac/utils";
import { useColorModeValue } from "./components/ui/color-mode";
import { useStacMap } from "./hooks";
import { getPadding } from "./utils";

type Color = [number, number, number, number];

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export default function Map() {
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useColorModeValue(
    "positron-gl-style",
    "dark-matter-gl-style",
  );
  const [fillColor] = useState<Color>([207, 63, 2, 50]);
  const [lineColor] = useState<Color>([207, 63, 2, 100]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [valueLayer, setValueLayer] = useState<Layer | null>();
  const [collectionsLayer, setCollectionsLayer] = useState<Layer | null>();
  const [stacGeoparquetLayer, setStacGeoparquetLayer] =
    useState<Layer | null>();
  const {
    value,
    collections,
    selectedCollections,
    stacGeoparquetTable,
    stacGeoparquetMetadata,
    setStacGeoparquetItemId,
    stacGeoparquetItem,
  } = useStacMap();

  useEffect(() => {
    if (value) {
      setValueLayer(getValueLayer({ value, lineColor, fillColor }));
    } else {
      setValueLayer(null);
    }
  }, [value, fillColor, lineColor]);

  useEffect(() => {
    if (value) {
      const bbox = getValueBbox(value);
      if (bbox && mapRef.current) {
        mapRef.current.fitBounds(sanitizeBbox(bbox), { padding: getPadding() });
      }
    }
  }, [value]);

  useEffect(() => {
    if (collections) {
      setCollectionsLayer(
        getCollectionsLayer({
          collections,
          fillColor,
          lineColor,
          selectedCollections,
        }),
      );
    } else {
      setCollectionsLayer(null);
    }
  }, [collections, selectedCollections, lineColor, fillColor]);

  useEffect(() => {
    if (collections) {
      const bbox = getCollectionsExtent(collections);
      if (bbox && mapRef.current) {
        mapRef.current.fitBounds(sanitizeBbox(bbox), { padding: getPadding() });
      }
    }
  }, [collections]);

  useEffect(() => {
    if (stacGeoparquetTable) {
      setStacGeoparquetLayer(
        getStacGeoparquetLayer(
          stacGeoparquetTable,
          lineColor,
          fillColor,
          setStacGeoparquetItemId,
          stacGeoparquetItem,
        ),
      );
    } else {
      setStacGeoparquetLayer(null);
    }
  }, [
    stacGeoparquetTable,
    fillColor,
    lineColor,
    setStacGeoparquetItemId,
    stacGeoparquetItem,
  ]);

  useEffect(() => {
    if (stacGeoparquetMetadata && mapRef.current) {
      mapRef.current.fitBounds(stacGeoparquetMetadata.bbox, {
        padding: getPadding(),
      });
    }
  }, [stacGeoparquetMetadata]);

  useEffect(() => {
    const layers = [];
    if (stacGeoparquetLayer) {
      layers.push(stacGeoparquetLayer);
    }
    if (collectionsLayer) {
      layers.push(collectionsLayer);
    }
    if (valueLayer) {
      layers.push(valueLayer);
    }
    setLayers(layers);
  }, [stacGeoparquetLayer, collectionsLayer, valueLayer]);

  return (
    <MaplibreMap
      id="map"
      ref={mapRef}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1,
      }}
      style={{
        height: "100dvh",
        width: "100dvw",
      }}
      mapStyle={`https://basemaps.cartocdn.com/gl/${mapStyle}/style.json`}
    >
      <DeckGLOverlay layers={layers}></DeckGLOverlay>
    </MaplibreMap>
  );
}

function getValueLayer({
  value,
  lineColor,
  fillColor,
}: {
  value: StacValue;
  lineColor: Color;
  fillColor: Color;
}) {
  switch (value.type) {
    case "Collection":
      if (!value.extent?.spatial?.bbox?.[0]) {
        return null;
      }

      return new GeoJsonLayer({
        id: "value",
        data: bboxPolygon(sanitizeBbox(value.extent.spatial.bbox[0]) as BBox),
        stroked: true,
        filled: true,
        getLineColor: lineColor,
        getFillColor: fillColor,
        lineWidthUnits: "pixels",
        getLineWidth: 2,
      });
    case "FeatureCollection":
      if (value.features.length == 0) {
        return null;
      } else {
        return new GeoJsonLayer({
          id: "value",
          // @ts-expect-error Don't want to bother typing correctly
          data: value,
          stroked: true,
          filled: true,
          getLineColor: fillColor,
          getFillColor: fillColor,
          lineWidthUnits: "pixels",
          getLineWidth: 2,
        });
      }
    case "Feature":
      return new GeoJsonLayer({
        id: "value",
        // @ts-expect-error Don't want to bother typing correctly
        data: value,
        stroked: true,
        filled: true,
        getLineColor: fillColor,
        getFillColor: fillColor,
        lineWidthUnits: "pixels",
        getLineWidth: 2,
      });
    default:
      return null;
  }
}

function getStacGeoparquetLayer(
  table: Table,
  fillColor: Color,
  lineColor: Color,
  setStacGeoparquetItemId: (id: string) => void,
  stacGeoparquetItem: StacItem | undefined,
) {
  const inverseFillColor = invertColor(fillColor);
  const inverseLineColor = invertColor(lineColor);
  return new GeoArrowPolygonLayer({
    id: "stac-geoparquet",
    data: table,
    stroked: true,
    filled: true,
    getFillColor: (info) => {
      if (
        stacGeoparquetItem &&
        stacGeoparquetItem?.id == table.getChild("id")?.get(info.index)
      ) {
        return inverseFillColor;
      } else {
        return fillColor;
      }
    },
    getLineColor: (info) => {
      if (
        stacGeoparquetItem &&
        stacGeoparquetItem?.id == table.getChild("id")?.get(info.index)
      ) {
        return inverseLineColor;
      } else {
        return lineColor;
      }
    },
    lineWidthUnits: "pixels",
    autoHighlight: true,
    pickable: true,
    onClick: (info) => {
      setStacGeoparquetItemId(table.getChild("id")?.get(info.index));
    },
    updateTriggers: {
      getFillColor: [stacGeoparquetItem],
    },
  });
}

function getCollectionsLayer({
  collections,
  selectedCollections,
  lineColor,
  fillColor,
}: {
  collections: StacCollection[];
  selectedCollections: Set<string>;
  lineColor: Color;
  fillColor: Color;
}) {
  const validCollections = collections.filter(
    (collection) => collection.extent?.spatial?.bbox?.[0],
  );

  return new GeoJsonLayer({
    id: "collections",
    data: validCollections.map((collection) =>
      bboxPolygon(sanitizeBbox(collection.extent.spatial.bbox[0]) as BBox, {
        id: collection.id,
      }),
    ),
    stroked: true,
    filled: true,
    getLineColor: lineColor,
    getFillColor: (feature) => {
      if (feature.id && selectedCollections.has(feature.id.toString())) {
        return fillColor;
      } else {
        return [fillColor[0], fillColor[1], fillColor[2], 0];
      }
    },
    lineWidthUnits: "pixels",
    getLineWidth: 2,
  });
}

function getValueBbox(value: StacValue) {
  switch (value.type) {
    case "Catalog":
      return null;
    case "Collection":
      return value.extent?.spatial?.bbox?.[0];
    case "Feature":
      return value.bbox;
    case "FeatureCollection":
      return getItemCollectionExtent(value);
  }
}

function invertColor(color: Color) {
  return [256 - color[0], 256 - color[1], 256 - color[2], color[3]] as Color;
}
