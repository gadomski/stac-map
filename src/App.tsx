import { Box } from "@chakra-ui/react";
import { useState } from "react";
import "./app.css";
import Map from "./components/map";
import Overlay from "./components/overlay";
import type { StacValue } from "./components/stac";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [value, setValue] = useState<StacValue | undefined>();

  return (
    <>
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
        <Overlay value={value} setValue={setValue}></Overlay>
      </Box>
      <Toaster></Toaster>
    </>
  );
}

export default App;
