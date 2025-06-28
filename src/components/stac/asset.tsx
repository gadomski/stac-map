import {
  Card,
  EmptyState,
  HStack,
  IconButton,
  type IconButtonProps,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuDownload, LuImageMinus } from "react-icons/lu";
import type { StacAsset } from "stac-ts";

export function AssetCard({
  assetKey,
  asset,
}: {
  assetKey: string;
  asset: StacAsset;
}) {
  const [showImage, setShowImage] = useState(false);
  const [description, setDescription] = useState(
    "Asset is not JPEG or PNG media type",
  );

  const iconButtonProps: IconButtonProps = {
    size: "2xs",
    variant: "subtle",
  };

  useEffect(() => {
    setShowImage(["image/jpeg", "image/png"].includes(asset.type || ""));
  }, [asset, setShowImage]);

  return (
    <Card.Root size={"sm"}>
      <Card.Header>
        <Text fontWeight={"lighter"} fontSize={"2xs"}>
          {assetKey}
        </Text>
      </Card.Header>
      <Card.Body>
        {(showImage && (
          <Image
            src={asset.href}
            onError={() => {
              setDescription("Image failed to load");
              setShowImage(false);
            }}
          ></Image>
        )) || (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuImageMinus></LuImageMinus>
              </EmptyState.Indicator>
              <EmptyState.Title>Cannot display</EmptyState.Title>
              <EmptyState.Description>{description}</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        )}
      </Card.Body>
      <Card.Footer>
        <Stack gap={4}>
          <Text fontSize={"2xs"}>{asset.type}</Text>
          <HStack>
            <IconButton {...iconButtonProps} asChild>
              <a href={asset.href}>
                <LuDownload></LuDownload>
              </a>
            </IconButton>
          </HStack>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}
