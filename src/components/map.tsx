import { type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import {
  Map as MaplibreMap,
  useControl,
  type MapRef,
} from "react-map-gl/maplibre";
import { useLayers } from "./map/context";
import { useColorModeValue } from "./ui/color-mode";

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export function Map() {
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useColorModeValue(
    "positron-gl-style",
    "dark-matter-gl-style"
  );
  const { layers, bounds } = useLayers();

  useEffect(() => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 200 });
    }
  }, [bounds]);

  return (
    <MaplibreMap
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
