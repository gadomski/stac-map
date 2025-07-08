import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MapProvider } from "react-map-gl/dist/esm/exports-maplibre";
import { Toaster } from "./components/ui/toaster";
import Header from "./header";
import Map from "./map";
import Panel from "./panel";
import { StacMapProvider } from "./provider";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MapProvider>
        <StacMapProvider>
          <Box zIndex={0} position={"absolute"} top={0} left={0}>
            <Map></Map>
          </Box>
          <Container zIndex={1} fluid h={"dvh"} pointerEvents={"none"}>
            <Box pointerEvents={"auto"}>
              <Header></Header>
            </Box>
            <SimpleGrid columns={3}>
              <Box pointerEvents={"auto"}>
                <Panel></Panel>
              </Box>
            </SimpleGrid>
          </Container>
          <Toaster></Toaster>
        </StacMapProvider>
      </MapProvider>
    </QueryClientProvider>
  );
}
