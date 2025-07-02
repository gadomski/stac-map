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
import type { ComponentType, ReactNode } from "react";
import { LuExternalLink } from "react-icons/lu";
import { MarkdownHooks } from "react-markdown";
import type { StacAsset, StacLink } from "stac-ts";
import { Prose } from "../ui/prose";
import type { StacValue } from "./types";

export default function Value({
  value,
  type,
  selfLinkButtonsType: SelfLinkButtonsType = SelfLinkButtons,
}: {
  value: StacValue;
  type?: string;
  selfLinkButtonsType?: ComponentType<SelfLinkButtonsProps>;
}) {
  const thumbnailAsset =
    typeof value.assets === "object" &&
    value.assets &&
    "thumbnail" in value.assets &&
    (value.assets.thumbnail as StacAsset);
  const selfLink = value.links?.find((link) => link.rel == "self");

  return (
    <Stack>
      <Text fontSize={"xs"} fontWeight={"lighter"}>
        {type || value.type}
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

      {selfLink && <SelfLinkButtonsType link={selfLink}></SelfLinkButtonsType>}
    </Stack>
  );
}

export interface SelfLinkButtonsProps {
  link: StacLink;
  children?: ReactNode;
}

export function SelfLinkButtons({ link, children }: SelfLinkButtonsProps) {
  return (
    <HStack>
      <Clipboard.Root value={link.href}>
        <Clipboard.Trigger asChild>
          <IconButton variant="surface" size="xs">
            <Clipboard.Indicator />
          </IconButton>
        </Clipboard.Trigger>
      </Clipboard.Root>
      <Button asChild variant={"surface"} size={"xs"}>
        <a href={link.href} target="_blank">
          Open <LuExternalLink></LuExternalLink>
        </a>
      </Button>
      <Button asChild variant={"surface"} size={"xs"}>
        <a
          href={
            "https://radiantearth.github.io/stac-browser/#/external/" +
            link.href.replace(/^(https?:\/\/)/, "")
          }
          target="_blank"
        >
          STAC Browser <LuExternalLink></LuExternalLink>
        </a>
      </Button>
      {children}
    </HStack>
  );
}
