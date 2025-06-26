import { Box, Center, Container, Spinner } from "@chakra-ui/react";
import { Layer } from "@deck.gl/core";
import { useEffect, useState } from "react";
import "./app.css";
import Header from "./components/header";
import { Map } from "./components/map";
import { MapProvider } from "./components/map/provider";
import { Panel } from "./components/panel";
import { useStacValue } from "./components/stac/hooks";
import { isUrl } from "./components/stac/utils";
import { toaster, Toaster } from "./components/ui/toaster";

export default function App() {
  const {
    href,
    setHref,
    value,
    stacGeoparquetPath,
    fileUpload,
    loading,
    error,
  } = useStacValue(getInitialHref());
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("href") != href) {
      history.pushState(null, "", "?href=" + href);
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
    if (error) {
      toaster.create({
        type: "error",
        title: "Error fetching STAC value",
        description: error,
      });
    }
  }, [error]);

  return (
    <MapProvider>
      <Box zIndex={0} position={"absolute"} top={0} left={0}>
        <Map layers={layers}></Map>
      </Box>
      <Container zIndex={1} fluid h={"dvh"} pointerEvents={"none"}>
        <Header href={href} setHref={setHref}></Header>
        <Panel
          href={href}
          value={value}
          stacGeoparquetPath={stacGeoparquetPath}
          setHref={setHref}
          fileUpload={fileUpload}
          setLayers={setLayers}
        ></Panel>
      </Container>
      {loading && (
        <Box zIndex={2} pos={"absolute"} inset={0} pointerEvents={"none"}>
          <Center h={"full"}>
            <Spinner></Spinner>
          </Center>
        </Box>
      )}
      <Toaster></Toaster>
    </MapProvider>
  );
}

function getInitialHref() {
  const href = new URLSearchParams(location.search).get("href") || "";
  if (isUrl(href)) {
    return href;
  } else {
    return "";
  }
}
