import {
  Badge,
  Box,
  Card,
  CloseButton,
  Code,
  Dialog,
  HStack,
  IconButton,
  Image,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useEffect } from "react";
import {
  LuCopy,
  LuCopyCheck,
  LuDownload,
  LuFile,
  LuSearchCode,
} from "react-icons/lu";
import type { StacAsset, StacItem } from "stac-ts";
import { useLayersDispatch } from "../map/context";
import { Tooltip } from "../ui/tooltip";
import { ValueInfo } from "./shared";

const PREVIEW_MEDIA_TYPES = ["image/jpeg", "image/png"];

function AssetCard({
  assetKey,
  asset,
}: {
  assetKey: string;
  asset: StacAsset;
}) {
  const clipboard = useClipboard({ value: asset.href });
  const preview = asset.type && PREVIEW_MEDIA_TYPES.includes(asset.type);

  return (
    <Card.Root size={"sm"}>
      <Card.Header>{asset.title || assetKey}</Card.Header>
      <Card.Body>
        {(preview && <Image src={asset.href} maxH={"100%"}></Image>) || (
          <Text fontSize={"xs"} fontWeight={"lighter"}>
            {asset.type}
          </Text>
        )}
      </Card.Body>
      <Card.Footer>
        <Stack>
          <HStack>
            <Tooltip content="Copy the asset href to your clipboard">
              <IconButton
                variant={"surface"}
                size={"xs"}
                onClick={clipboard.copy}
              >
                {clipboard.copied ? (
                  <LuCopyCheck></LuCopyCheck>
                ) : (
                  <LuCopy></LuCopy>
                )}
              </IconButton>
            </Tooltip>
            <Tooltip content="Download the asset">
              <IconButton asChild variant={"surface"} size={"xs"}>
                <a href={asset.href}>
                  <LuDownload></LuDownload>
                </a>
              </IconButton>
            </Tooltip>
            <Dialog.Root scrollBehavior={"inside"} size={"xl"}>
              <Dialog.Trigger>
                <Tooltip content="Show the raw asset JSON in a dialog">
                  <IconButton variant={"surface"} size={"xs"}>
                    <LuSearchCode></LuSearchCode>
                  </IconButton>
                </Tooltip>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>{assetKey}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <pre style={{ width: "100%" }}>
                        <Code width={"100%"} p={2}>
                          {JSON.stringify(asset, null, 2)}
                        </Code>
                      </pre>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </HStack>
          <Tooltip content="Asset roles">
            <Box>
              {asset.roles?.map((role) => (
                <Badge key={"role:" + role}>{role}</Badge>
              ))}
            </Box>
          </Tooltip>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}

export function Item({ item }: { item: StacItem }) {
  const dispatch = useLayersDispatch();

  useEffect(() => {
    if (item.geometry) {
      const layer = new GeoJsonLayer({
        id: "stac-item",
        // @ts-expect-error Don't want to bother getting typing correct
        data: item,
        stroked: true,
        filled: true,
        getFillColor: [207, 63, 2, 100],
      });
      dispatch({ type: "set-layers", layers: [layer], bbox: item.bbox });
    }
  }, [item, dispatch]);

  return (
    <Stack>
      <ValueInfo
        type={"Item"}
        id={item.id}
        icon={<LuFile></LuFile>}
      ></ValueInfo>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {Object.entries(item.assets).map(([key, asset]) => (
          <AssetCard
            key={"asset:" + key}
            asset={asset}
            assetKey={key}
          ></AssetCard>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
