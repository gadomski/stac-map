import {
  Button,
  Clipboard,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { MarkdownHooks } from "react-markdown";
import type { StacAsset } from "stac-ts";
import { Prose } from "../ui/prose";
import Catalog from "./catalog";
import Collection from "./collection";
import Item from "./item";
import ItemCollection from "./item-collection";
import type { StacValue } from "./types";

export default function Value({
  value,
  parquetPath,
}: {
  value: StacValue;
  parquetPath?: string;
}) {
  return (
    <Stack position={"relative"} gap={8}>
      <ValueHeader value={value}></ValueHeader>
      {value.type === "Catalog" && <Catalog catalog={value}></Catalog>}
      {value.type === "Collection" && (
        <Collection collection={value}></Collection>
      )}
      {value.type === "Feature" && <Item item={value}></Item>}
      {value.type === "FeatureCollection" && (
        <ItemCollection
          itemCollection={value}
          parquetPath={parquetPath}
        ></ItemCollection>
      )}
    </Stack>
  );
}

function ValueHeader({ value }: { value: StacValue }) {
  const thumbnailAsset =
    typeof value.assets === "object" &&
    value.assets &&
    "thumbnail" in value.assets &&
    (value.assets.thumbnail as StacAsset);
  const selfLink = value.links?.find((link) => link.rel == "self");

  return (
    <Stack>
      <Text fontSize={"xs"} fontWeight={"lighter"}>
        {value.type}
      </Text>
      <Heading>{(value.title as string) ?? value.id ?? ""}</Heading>
      {thumbnailAsset && (
        <Image
          src={thumbnailAsset.href}
          height={200}
          fit={"scale-down"}
        ></Image>
      )}
      {(value.description as string) && (
        <Prose>
          <MarkdownHooks>{value.description as string}</MarkdownHooks>
        </Prose>
      )}
      {selfLink && (
        <HStack>
          <Clipboard.Root value={selfLink.href}>
            <Clipboard.Trigger asChild>
              <IconButton variant="surface" size="xs">
                <Clipboard.Indicator />
              </IconButton>
            </Clipboard.Trigger>
          </Clipboard.Root>
          <Button asChild variant={"surface"} size={"xs"}>
            <a href={selfLink.href} target="_blank">
              Open <LuExternalLink></LuExternalLink>
            </a>
          </Button>
          <Button asChild variant={"surface"} size={"xs"}>
            <a
              href={
                "https://radiantearth.github.io/stac-browser/#/external/" +
                selfLink.href.replace(/^(https?:\/\/)/, "")
              }
              target="_blank"
            >
              STAC Browser <LuExternalLink></LuExternalLink>
            </a>
          </Button>
          {value.type == "Feature" && (
            <Button asChild variant={"surface"} size={"xs"}>
              <a
                href={"https://titiler.xyz/stac/viewer?url=" + selfLink.href}
                target="_blank"
              >
                TiTiler <LuExternalLink></LuExternalLink>
              </a>
            </Button>
          )}
        </HStack>
      )}
    </Stack>
  );
}
