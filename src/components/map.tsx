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
import {
  useStacGeoparquet,
  useStacGeoparquetDispatch,
} from "./stac-geoparquet/hooks";
import { useColorModeValue } from "./ui/color-mode";

function DeckGLOverlay(props: DeckProps) {
  const control = useControl<MapboxOverlay>(() => new MapboxOverlay({}));
  control.setProps(props);
  return <></>;
}

export default function Map() {
  const state = useStacGeoparquet();
  const dispatch = useStacGeoparquetDispatch();
  const [layers, setLayers] = useState<GeoArrowPolygonLayer[]>([]);
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useColorModeValue(
    "positron-gl-style",
    "dark-matter-gl-style"
  );

  useEffect(() => {
    if (state.table) {
      const layer = new GeoArrowPolygonLayer({
        id: "geoarrow-polygons",
        data: state.table,
        stroked: true,
        filled: true,
        getFillColor: () => {
          return [207, 63, 2, 100];
        },
        pickable: true,
        autoHighlight: true,
        highlightColor: [252, 192, 38],
        onClick: (info) => {
          if (state.table) {
            const id = state.table.getChild("id")?.get(info.index);
            dispatch({ type: "set-id", id });
          }
        },
      });
      setLayers([layer]);
    } else {
      setLayers([]);
    }
  }, [state.table, dispatch]);

  useEffect(() => {
    if (state.metadata) {
      if (mapRef.current) {
        mapRef.current.fitBounds(state.metadata.bounds, { padding: 100 });
      }
    }
  }, [state.metadata]);

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
