import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { LuExternalLink } from "react-icons/lu";
import { RawJsonDialogButton } from "../json";
import type { StacValue } from "./types";
import { getSelfHref } from "./utils";

export function ValueInfo({
  type,
  value,
  id,
  title,
  description,
  hideJsonButton,
}: {
  type: string;
  value: StacValue;
  icon: ReactNode;
  id: string;
  title?: string;
  description?: string;
  hideJsonButton?: boolean;
}) {
  const heading = title || id;
  const selfHref = getSelfHref(value);
  const selfHrefButtons = (selfHref && (
    <>
      <Button size={"xs"} variant={"surface"} asChild>
        <a href={selfHref} target="_blank">
          Open <LuExternalLink></LuExternalLink>
        </a>
      </Button>
      <Button size={"xs"} variant={"surface"} asChild>
        <a
          href={
            "https://radiantearth.github.io/stac-browser/#/external/" +
            selfHref.replace(/^(https?:\/\/)/, "")
          }
          target="_blank"
        >
          STAC Browser <LuExternalLink></LuExternalLink>
        </a>
      </Button>
    </>
  )) || <></>;
  return (
    <Stack>
      <Text color={"fg.subtle"} fontSize={"small"}>
        {type}
      </Text>
      <Heading>{heading}</Heading>
      {description && <Text fontWeight={"light"}>{description}</Text>}
      <HStack>
        {selfHrefButtons}
        {!hideJsonButton && (
          <RawJsonDialogButton
            title={id}
            value={value}
            size={"xs"}
            variant={"surface"}
          ></RawJsonDialogButton>
        )}
      </HStack>
    </Stack>
  );
}
