import { Box, Heading, Image, Spinner, Stack, Text } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import Markdown from "react-markdown";
import type { StacAsset } from "stac-ts";
import { useStacCollections, useStacLayers } from "../stac/hooks";
import { Prose } from "../ui/prose";
import { toaster } from "../ui/toaster";
import { Collections } from "./collection";
import Item from "./item";
import ItemCollection from "./item-collection";
import { NaturalLanguageCollectionSearch } from "./natural-language";
import type { StacValue } from "./types";

export default function Value({
  href,
  value,
  setLayers,
  parquetPath,
}: {
  href: string;
  value: StacValue;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  parquetPath: string | undefined;
}) {
  const { collections, loading, error } = useStacCollections(value);
  const { layers } = useStacLayers(value, collections, parquetPath);

  const thumbnailAsset =
    typeof value.assets === "object" &&
    value.assets &&
    "thumbnail" in value.assets &&
    (value.assets.thumbnail as StacAsset);

  useEffect(() => {
    if (layers) {
      setLayers(layers);
    }
  }, [layers, setLayers]);

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
      {thumbnailAsset && <Image src={thumbnailAsset.href}></Image>}
      {(value.description as string) && (
        <Prose>
          <Markdown>{value.description as string}</Markdown>
        </Prose>
      )}
      {value.type === "Feature" && <Item item={value}></Item>}
      {value.type === "FeatureCollection" && (
        <ItemCollection itemCollection={value}></ItemCollection>
      )}
      {value.type === "Catalog" && collections && (
        <NaturalLanguageCollectionSearch
          href={href}
          collections={collections}
        ></NaturalLanguageCollectionSearch>
      )}
      {collections && (
        <Box mt={4}>
          <Heading size={"md"}>Collections</Heading>
          <Collections collections={collections}></Collections>
        </Box>
      )}
    </Stack>
  );
}
