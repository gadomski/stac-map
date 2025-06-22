import { Box, Heading, SimpleGrid, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";
import { useStac } from "./stac/hooks";
import type { StacValue } from "./stac/types";

function Value({ value }: { value: StacValue }) {
  // @ts-expect-error Items don't have a title.
  const title: string = value.title || value.id || "missing id";
  return (
    <Stack gap={0}>
      <Heading fontSize={"xs"} fontWeight={"lighter"}>
        {value.type}
      </Heading>
      <Heading>{title}</Heading>
      {value.title !== undefined && typeof value.id === "string" && (
        <Heading fontSize={"xs"} fontWeight={"lighter"}>
          {value.id}
        </Heading>
      )}
      {typeof value.description === "string" && (
        <Text lineClamp={3} fontSize={"md"} fontWeight={"light"}>
          {value.description}
        </Text>
      )}
    </Stack>
  );
}

export default function Panel() {
  const [tabValue, setTabValue] = useState<string | undefined>();
  const { value } = useStac();

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} my={2}>
      <Tabs.Root
        bg={"bg.muted"}
        pointerEvents={"auto"}
        defaultValue={"container"}
        rounded={"sm"}
        overflow={"scroll"}
        maxH={{ base: "40vh", md: "90vh" }}
        pb={4}
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
      >
        <Tabs.List>
          <Tabs.Trigger value="value">
            <LuInfo></LuInfo>
          </Tabs.Trigger>
        </Tabs.List>
        <Box px={4}>
          <Tabs.Content value="value">
            {value && <Value value={value}></Value>}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </SimpleGrid>
  );
}
