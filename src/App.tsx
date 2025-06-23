import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./app.css";
import Header from "./components/header";
import { Map } from "./components/map";
import { LayersProvider } from "./components/map/provider";
import Overlay from "./components/overlay";
import { Panel } from "./components/panel";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [href, setHref] = useState(
    new URLSearchParams(location.search).get("href") ?? ""
  );

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
  }, []);

  return (
    <LayersProvider>
      <Box position={"absolute"} top={0} left={0} zIndex={0}>
        <Map></Map>
      </Box>
      <Box zIndex={1}>
        <Overlay>
          <Header href={href} setHref={setHref}></Header>
          <Panel href={href}></Panel>
        </Overlay>
      </Box>
      <Toaster></Toaster>
    </LayersProvider>
  );
}

export default App;
