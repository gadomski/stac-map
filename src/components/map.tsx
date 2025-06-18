import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "react";
import { type MapRef, Map as MaplibreMap } from "react-map-gl/maplibre";

export default function Map() {
  const mapRef = useRef<MapRef>(null);

  return (
    <MaplibreMap
      ref={mapRef}
      initialViewState={{
        longitude: -105.1019,
        latitude: 40.1672,
        zoom: 8,
      }}
      style={{
        height: "100vh",
        width: "100vw",
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    ></MaplibreMap>
  );
}
