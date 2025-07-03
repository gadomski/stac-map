import { Box, Container, SimpleGrid, useFileUpload } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { useEffect, useState } from "react";
import { MapProvider } from "react-map-gl/maplibre";
import { Toaster } from "./components/ui/toaster";
import Upload from "./components/upload";
import Header from "./header";
import Map from "./map";
import Panel from "./panel";

export default function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [href, setHref] = useState<string | undefined>(getInitialHref());
  const fileUpload = useFileUpload({ maxFiles: 1 });

  useEffect(() => {
    // It should never be more than 1.
    if (fileUpload.acceptedFiles.length == 1) {
      setHref(fileUpload.acceptedFiles[0].name);
    }
  }, [fileUpload.acceptedFiles, setHref]);

  useEffect(() => {
    if (href) {
      if (new URLSearchParams(location.search).get("href") != href) {
        history.pushState(null, "", "?href=" + href);
      }
    }
  }, [href]);

  useEffect(() => {
    function handlePopState() {
      setHref(new URLSearchParams(location.search).get("href") ?? "");
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setHref]);

  useEffect(() => {
    setLayers([]);
  }, [href]);

  return (
    <MapProvider>
      <Box zIndex={0} position={"absolute"} top={0} left={0}>
        <Map layers={layers}></Map>
      </Box>
      <Container zIndex={1} fluid h={"dvh"} pointerEvents={"none"}>
        <Box pointerEvents={"auto"}>
          <Header href={href} setHref={setHref}></Header>
        </Box>
        <SimpleGrid columns={3}>
          <Box pointerEvents={"auto"}>
            {(href && (
              <Panel
                href={href}
                fileUpload={fileUpload}
                setLayers={setLayers}
              ></Panel>
            )) || <Upload fileUpload={fileUpload}></Upload>}
          </Box>
        </SimpleGrid>
      </Container>
      <Toaster></Toaster>
    </MapProvider>
  );
}

function getInitialHref() {
  const href = new URLSearchParams(location.search).get("href") || "";
  try {
    new URL(href);
  } catch {
    return undefined;
  }
  return href;
}
