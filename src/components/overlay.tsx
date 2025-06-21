import { Container } from "@chakra-ui/react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";
import { useStac } from "./stac/hooks";

export default function Overlay() {
  const { container } = useStac();
  return (
    <Container fluid py={2} h={"100vh"} pointerEvents={"none"}>
      <Header></Header>
      {container && <Sidebar container={container}></Sidebar>}
      <Footer></Footer>
    </Container>
  );
}
