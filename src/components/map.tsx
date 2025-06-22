import { Layer, type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import { GeoJsonLayer } from "deck.gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import {
  Map as MaplibreMap,
  useControl,
  type MapRef,
} from "react-map-gl/maplibre";
import { useStac } from "./stac/hooks";
import { useColorModeValue } from "./ui/color-mode";

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export default function Map() {
  const { table, bbox, geojson } = useStac();
  const [tableLayer, setTableLayer] = useState<GeoArrowPolygonLayer>();
  const [geoJsonLayer, setGeoJsonLayer] = useState<Layer>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useColorModeValue(
    "positron-gl-style",
    "dark-matter-gl-style"
  );

  useEffect(() => {
    if (table) {
      const layer = new GeoArrowPolygonLayer({
        id: "geoarrow-polygons",
        data: table,
        stroked: true,
        filled: true,
        getFillColor: () => {
          return [207, 63, 2, 100];
        },
        pickable: true,
        autoHighlight: true,
        highlightColor: [252, 192, 38],
      });
      setTableLayer(layer);
    } else {
      setTableLayer(undefined);
    }
  }, [table]);

  useEffect(() => {
    if (bbox) {
      if (mapRef.current) {
        mapRef.current.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          { padding: 100 }
        );
      }
    }
  }, [bbox]);

  useEffect(() => {
    if (geojson) {
      const layer = new GeoJsonLayer({
        id: "geojson",
        data: geojson,
        stroked: false,
        filled: true,
        pickable: true,
        getFillColor: [160, 160, 180, 200],
      });
      setGeoJsonLayer(layer);
    } else {
      setGeoJsonLayer(undefined);
    }
  }, [geojson]);

  useEffect(() => {
    const layers = [];
    if (geoJsonLayer) {
      layers.push(geoJsonLayer);
    }
    if (tableLayer) {
      layers.push(tableLayer);
    }
    setLayers(layers);
  }, [geoJsonLayer, tableLayer]);

  return (
    <MaplibreMap
      ref={mapRef}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1,
      }}
      style={{
        height: "100vh",
        width: "100vw",
      }}
      mapStyle={`https://basemaps.cartocdn.com/gl/${mapStyle}/style.json`}
    >
      <DeckGLOverlay layers={layers}></DeckGLOverlay>
    </MaplibreMap>
  );
}
