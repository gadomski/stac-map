import { Container } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useState, type Dispatch, type SetStateAction } from "react";
import Header from "./header";
import { Panel } from "./panel";

export default function Overlay({
  setLayers,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [href, setHref] = useState("");
  return (
    <Container fluid h={"100vh"} pointerEvents={"none"}>
      <Header setHref={setHref}></Header>
      <Panel href={href} setLayers={setLayers}></Panel>
    </Container>
  );
}
