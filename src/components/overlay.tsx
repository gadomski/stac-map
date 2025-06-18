import { Container, HStack, Input } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";

export default function Overlay() {
  return (
    <Container
      my={1}
      mx={4}
      style={{
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        width: "100vw",
      }}
    >
      <HStack>
        <Input
          variant={"flushed"}
          placeholder="Provide the URL to a stac-geoparquet file (or files), or drag-and-drop a file into the browser window"
        ></Input>
        <ColorModeButton mx={2}></ColorModeButton>
      </HStack>
    </Container>
  );
}
