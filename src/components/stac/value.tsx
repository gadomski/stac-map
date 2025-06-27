import { Heading, Stack, Text } from "@chakra-ui/react";
import type { StacValue } from "./types";

export default function Value({ value }: { value: StacValue }) {
  return (
    <Stack>
      <Text fontSize={"xs"} fontWeight={"lighter"}>
        {value.type}
      </Text>
      <Heading>{(value.title as string) ?? value.id ?? ""}</Heading>
    </Stack>
  );
}
