import { type DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import {
  Map as MaplibreMap,
  useControl,
  type MapRef,
} from "react-map-gl/maplibre";
import { useStac, useStacDispatch } from "./stac/hooks";
import { useColorModeValue } from "./ui/color-mode";

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export default function Map() {
  const [layers, setLayers] = useState<GeoArrowPolygonLayer[]>([]);
  const { table, container } = useStac();
  const dispatch = useStacDispatch();
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
        onClick: (info) => {
          if (table) {
            const id = table.getChild("id")?.get(info.index);
            dispatch({ type: "set-id", id });
          }
        },
      });
      setLayers([layer]);
    } else {
      setLayers([]);
    }
  }, [table, dispatch]);

  useEffect(() => {
    if (container?.type == "FeatureCollection" && mapRef.current) {
      mapRef.current.fitBounds(container.bounds, { padding: 100 });
    }
  }, [container]);

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
      onMoveEnd={() => {
        if (mapRef.current) {
          dispatch({ type: "set-bounds", bounds: mapRef.current.getBounds() });
        }
      }}
    >
      <DeckGLOverlay layers={layers}></DeckGLOverlay>
    </MaplibreMap>
  );
}
