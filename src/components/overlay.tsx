import { Container } from "@chakra-ui/react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Overlay() {
  return (
    <Container fluid py={2} h={"100vh"} pointerEvents={"none"}>
      <Header></Header>
      <Sidebar></Sidebar>
      <Footer></Footer>
    </Container>
  );
}
