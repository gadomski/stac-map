import { Layer, type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import {
  Map as MaplibreMap,
  useControl,
  type MapRef,
} from "react-map-gl/maplibre";
import { useAppState, useAppStateDispatch } from "./components/hooks";
import { useColorModeValue } from "./components/ui/color-mode";

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export default function Map({ layers }: { layers: Layer[] }) {
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useColorModeValue(
    "positron-gl-style",
    "dark-matter-gl-style",
  );
  const { fitBounds } = useAppState();
  const dispatch = useAppStateDispatch();

  useEffect(() => {
    if (fitBounds && mapRef.current) {
      // TODO make this work for smaller screens, this is hard-coded to the large display
      const delta = (fitBounds.getEast() - fitBounds.getWest()) / 3;
      const expandedBounds = new LngLatBounds([
        fitBounds.getWest() - delta,
        fitBounds.getSouth(),
        fitBounds.getEast(),
        fitBounds.getNorth(),
      ]);
      mapRef.current.fitBounds(expandedBounds, { padding: 200 });
    }
  }, [fitBounds]);

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
      onMoveEnd={() =>
        dispatch({ type: "move-end", bounds: mapRef.current?.getBounds() })
      }
    >
      <DeckGLOverlay layers={layers}></DeckGLOverlay>
    </MaplibreMap>
  );
}
