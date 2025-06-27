import { Heading, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import Markdown from "react-markdown";
import type { StacCollection } from "stac-ts";
import { useStacCollections } from "../stac/hooks";
import { Prose } from "../ui/prose";
import { toaster } from "../ui/toaster";
import { CollectionCard } from "./collection";
import { getStacLayers } from "./layers";
import type { StacValue } from "./types";

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
      {(value.description as string) && (
        <Prose>
          <Markdown>{value.description as string}</Markdown>
        </Prose>
      )}
      {collections && <Collections collections={collections}></Collections>}
    </Stack>
  );
}

function Collections({ collections }: { collections: StacCollection[] }) {
  return (
    <SimpleGrid columns={2} gap={2}>
      {collections.map((collection) => (
        <CollectionCard
          collection={collection}
          key={collection.id}
        ></CollectionCard>
      ))}
    </SimpleGrid>
  );
}
