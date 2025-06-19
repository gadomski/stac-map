import { Box } from "@chakra-ui/react";
import "./App.css";
import Map from "./components/map";
import Overlay from "./components/overlay";
import StacGeoparquetProvider from "./components/stac-geoparquet/provider";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <StacGeoparquetProvider>
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Map></Map>
      </Box>
      <Overlay></Overlay>
      <Toaster></Toaster>
    </StacGeoparquetProvider>
  );
}

export default App;
