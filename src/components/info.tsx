import { Card, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import type { Dispatch, SetStateAction } from "react";
import type { StacCollection } from "stac-ts";
import type { StacValue } from "./stac/types";
import Value from "./stac/value";

export default function Info({
  value,
  collections,
  setHref,
  setLayers,
}: {
  value: StacValue;
  collections: StacCollection[] | undefined;
  setHref: Dispatch<SetStateAction<string | undefined>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  return (
    <Stack>
      <Value value={value}></Value>
      {collections && <Collections collections={collections}></Collections>}
    </Stack>
  );
}

function Collections({ collections }: { collections: StacCollection[] }) {
  return (
    <SimpleGrid columns={2} gap={2}>
      {collections.map((collection) => (
        <Collection collection={collection} key={collection.id}></Collection>
      ))}
    </SimpleGrid>
  );
}

function Collection({ collection }: { collection: StacCollection }) {
  return (
    <Card.Root size={"sm"} _hover={{ bg: "bg.emphasized" }} cursor={"pointer"}>
      <Card.Header>
        <Text fontWeight={"lighter"} fontSize={"2xs"}>
          {collection.id}
        </Text>
      </Card.Header>
      <Card.Body>
        <Heading fontSize={"sm"} lineHeight={1.5}>
          {collection.title ?? collection.id}
        </Heading>
      </Card.Body>
    </Card.Root>
  );
}
