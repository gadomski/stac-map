import { Box, Container } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { useState } from "react";
import { AppStateProvider } from "./components/provider";
import { Toaster } from "./components/ui/toaster";
import Header from "./header";
import Map from "./map";
import Panel from "./panel";

export default function App() {
  const [href, setHref] = useState<string | undefined>();
  const [layers, setLayers] = useState<Layer[]>([]);

  return (
    <AppStateProvider>
      <Box zIndex={0} position={"absolute"} top={0} left={0}>
        <Map layers={layers}></Map>
      </Box>
      <Container zIndex={1} fluid h={"dvh"} pointerEvents={"none"}>
        <Header href={href} setHref={setHref}></Header>
        <Panel href={href} setHref={setHref} setLayers={setLayers}></Panel>
      </Container>
      <Toaster></Toaster>
    </AppStateProvider>
  );
}
