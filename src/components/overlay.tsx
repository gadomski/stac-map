import { Container } from "@chakra-ui/react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Overlay() {
  return (
    <Container fluid py={2}>
      <Header></Header>
      <Sidebar></Sidebar>
    </Container>
  );
}
