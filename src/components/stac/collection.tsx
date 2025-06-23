import { Card, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { LuFolderPlus, LuUpload } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { RawJsonDialogButton } from "../json";
import { Tooltip } from "../ui/tooltip";
import { ValueInfo } from "./shared";
import { getSelfHref } from "./utils";

export function Collection({ collection }: { collection: StacCollection }) {
  return (
    <Stack>
      <ValueInfo
        type={"Collection"}
        value={collection}
        id={collection.id}
        icon={<LuFolderPlus></LuFolderPlus>}
        title={collection.title}
        description={collection.description}
      ></ValueInfo>
    </Stack>
  );
}

export function CollectionCard({
  collection,
  setHref,
}: {
  collection: StacCollection;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const selfHref = getSelfHref(collection);
  return (
    <Card.Root size={"sm"}>
      <Card.Header>
        <Text fontSize={"xs"}>{collection.title || collection.id}</Text>
      </Card.Header>
      <Card.Body>
        <Text lineClamp={3}>{collection.description}</Text>
      </Card.Body>
      <Card.Footer>
        <Card.Footer>
          <Stack>
            <HStack>
              {selfHref && (
                <Tooltip content="Load collection">
                  <IconButton
                    variant={"surface"}
                    size={"xs"}
                    onClick={() => setHref(selfHref)}
                  >
                    <LuUpload></LuUpload>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip content="View raw JSON">
                <RawJsonDialogButton
                  title={collection.id}
                  value={collection}
                  variant={"surface"}
                  size={"xs"}
                ></RawJsonDialogButton>
              </Tooltip>
            </HStack>
          </Stack>
        </Card.Footer>
      </Card.Footer>
    </Card.Root>
  );
}
