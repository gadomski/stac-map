import {
  Card,
  DataList,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { LuFolderPlus, LuUpload, LuZoomIn } from "react-icons/lu";
import Markdown from "react-markdown";
import type { StacCollection } from "stac-ts";
import { RawJsonDialogButton } from "../json";
import { useLayersDispatch } from "../map/context";
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
  const dispatch = useLayersDispatch();

  return (
    <Card.Root size={"sm"}>
      <Card.Header>
        <Text fontSize={"xs"}>{collection.title || collection.id}</Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          <Text lineClamp={3}>
            <Markdown>{collection.description}</Markdown>
          </Text>
          <DataList.Root orientation={"horizontal"}>
            <DataList.Item>
              <DataList.ItemLabel>Bounding box</DataList.ItemLabel>
              <DataList.ItemValue>
                {collection.extent.spatial.bbox[0]
                  .map((n) => Number(n.toFixed(4)))
                  .join(", ")}
              </DataList.ItemValue>
            </DataList.Item>
          </DataList.Root>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Card.Footer>
          <Stack>
            <HStack>
              <Tooltip content="Zoom to collection">
                <IconButton
                  variant={"surface"}
                  size={"xs"}
                  onClick={() =>
                    dispatch({
                      type: "set-bbox",
                      bbox: collection.extent.spatial.bbox[0],
                    })
                  }
                >
                  <LuZoomIn></LuZoomIn>
                </IconButton>
              </Tooltip>
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
