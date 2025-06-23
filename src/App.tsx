import { Box } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { useState } from "react";
import "./app.css";
import { Map } from "./components/map";
import Overlay from "./components/overlay";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [layers, setLayers] = useState<Layer[]>([]);

  return (
    <>
      <Box position={"absolute"} top={0} left={0} zIndex={0}>
        <Map layers={layers}></Map>
      </Box>
      <Box zIndex={1}>
        <Overlay setLayers={setLayers}></Overlay>
      </Box>
      <Toaster></Toaster>
    </>
  );
}

export default App;
