import { Box } from "@chakra-ui/react";
import "./app.css";
import Map from "./components/map";
import Overlay from "./components/overlay";
import { StacProvider } from "./components/stac/provider";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <StacProvider>
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <Map></Map>
      </Box>
      <Box style={{ zIndex: 1 }}>
        <Overlay></Overlay>
      </Box>
      <Toaster></Toaster>
    </StacProvider>
  );
}

export default App;
