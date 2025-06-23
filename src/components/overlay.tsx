import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";

export default function Overlay({ children }: { children: ReactNode }) {
  return (
    <Container fluid h={"100vh"} pointerEvents={"none"}>
      {children}
    </Container>
  );
}
