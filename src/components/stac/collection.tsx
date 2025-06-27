import {
  Card,
  Heading,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Stack,
  Text,
  type IconButtonProps,
} from "@chakra-ui/react";
import {
  LuCheck,
  LuFocus,
  LuMousePointerBan,
  LuMousePointerClick,
  LuX,
} from "react-icons/lu";
import Markdown from "react-markdown";
import type { StacCollection } from "stac-ts";
import { useAppStateDispatch, useIsPicked, useIsSelected } from "../hooks";
import { sanitizeBbox } from "../stac/utils";
import { Prose } from "../ui/prose";

export function Collections({
  collections,
}: {
  collections: StacCollection[];
}) {
  return (
    <SimpleGrid columns={2} gap={2} my={4}>
      {collections.map((collection) => (
        <CollectionCard
          collection={collection}
          key={collection.id}
        ></CollectionCard>
      ))}
    </SimpleGrid>
  );
}

export function CollectionCard({ collection }: { collection: StacCollection }) {
  const thumbnailLink = collection.assets?.thumbnail;
  const isSelected = useIsSelected(collection);
  const isPicked = useIsPicked(collection);
  const dispatch = useAppStateDispatch();

  const iconButtonProps: IconButtonProps = {
    size: "2xs",
    variant: "subtle",
  };

  return (
    <Card.Root
      size={"sm"}
      _hover={{ bg: "bg.emphasized" }}
      bg={(isPicked && "bg.emphasized") || "bg.panel"}
      borderColor={(isSelected && "orange.600/50") || "gray.200"}
    >
      <Card.Header>
        {collection.title && (
          <Text fontWeight={"lighter"} fontSize={"2xs"}>
            {collection.id}
          </Text>
        )}
      </Card.Header>
      <Card.Body>
        <Heading fontSize={"sm"} lineHeight={1.5}>
          {collection.title ?? collection.id}
        </Heading>
        {collection.description && (
          <Prose size={"md"} lineClamp={2} fontSize={"xs"}>
            <Markdown>{collection.description}</Markdown>
          </Prose>
        )}
      </Card.Body>
      <Card.Footer>
        <Stack gap={4}>
          {thumbnailLink && <Image src={thumbnailLink.href}></Image>}
          <HStack>
            {(isSelected && (
              <IconButton
                {...iconButtonProps}
                onClick={() =>
                  dispatch({ type: "deselect", value: collection })
                }
              >
                <LuX></LuX>
              </IconButton>
            )) || (
              <IconButton
                {...iconButtonProps}
                onClick={() => dispatch({ type: "select", value: collection })}
              >
                <LuCheck></LuCheck>
              </IconButton>
            )}
            {(isPicked && (
              <IconButton
                {...iconButtonProps}
                onClick={() => dispatch({ type: "pick" })}
              >
                <LuMousePointerBan></LuMousePointerBan>
              </IconButton>
            )) || (
              <IconButton
                {...iconButtonProps}
                onClick={() => dispatch({ type: "pick", value: collection })}
              >
                <LuMousePointerClick></LuMousePointerClick>
              </IconButton>
            )}
            <IconButton
              {...iconButtonProps}
              onClick={() =>
                dispatch({
                  type: "fit-bbox",
                  bbox: sanitizeBbox(collection.extent.spatial.bbox[0]),
                })
              }
            >
              <LuFocus></LuFocus>
            </IconButton>
          </HStack>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}
