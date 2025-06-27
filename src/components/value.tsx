import {
  Card,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { StacCollection } from "stac-ts";
import { useStacCollections } from "./stac/hooks";
import { getStacLayers } from "./stac/layers";
import type { StacValue } from "./stac/types";
import { toaster } from "./ui/toaster";

export default function Value({
  value,
  setLayers,
}: {
  value: StacValue;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const { collections, loading, error } = useStacCollections(value);

  useEffect(() => {
    setLayers(getStacLayers(value, collections));
  }, [value, collections, setLayers]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while loading collections",
        description: error,
      });
    }
  }, [error]);

  return (
    <Stack position={"relative"}>
      {loading && (
        <Spinner position={"absolute"} top={0} right={2} size={"sm"}></Spinner>
      )}
      <Text fontSize={"xs"} fontWeight={"lighter"}>
        {value.type}
      </Text>
      <Heading>{(value.title as string) ?? value.id ?? ""}</Heading>
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
