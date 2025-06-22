import { Container } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import Footer from "./footer";
import Header from "./header";
import Panel from "./panel";
import type { StacValue } from "./stac";

export default function Overlay({
  value,
  setValue,
}: {
  value?: StacValue;
  setValue: Dispatch<SetStateAction<StacValue | undefined>>;
}) {
  return (
    <Container fluid py={2} h={"100vh"} pointerEvents={"none"}>
      <Header setValue={setValue}></Header>
      <Panel value={value}></Panel>
      <Footer></Footer>
    </Container>
  );
}
