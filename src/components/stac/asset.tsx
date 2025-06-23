import {
  Badge,
  Box,
  Card,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { LuCopy, LuCopyCheck, LuDownload } from "react-icons/lu";
import type { StacAsset } from "stac-ts";
import { RawJsonDialogButton } from "../json";
import { Tooltip } from "../ui/tooltip";

const PREVIEW_MEDIA_TYPES = ["image/jpeg", "image/png"];

export function AssetCard({
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
            <RawJsonDialogButton
              title={assetKey}
              value={asset}
              variant={"surface"}
              size={"xs"}
            ></RawJsonDialogButton>
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
