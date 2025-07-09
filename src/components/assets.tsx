import {
  Badge,
  ButtonGroup,
  DataList,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import type { StacAsset } from "stac-ts";

export default function Assets({
  assets,
}: {
  assets: { [k: string]: StacAsset };
}) {
  return (
    <Stack>
      <Heading size={"sm"}>Assets</Heading>
      <DataList.Root>
        {Object.entries(assets).map(([key, asset]) => (
          <DataList.Item key={asset.href}>
            <DataList.ItemLabel>
              <HStack>
                {asset.title || key}

                {asset.roles &&
                  asset.roles.map((role) => <Badge key={role}>{role}</Badge>)}
              </HStack>
            </DataList.ItemLabel>
            <DataList.ItemValue>
              <HStack>
                <ButtonGroup size={"xs"} variant={"subtle"}>
                  <IconButton asChild>
                    <a href={asset.href} target="_blank">
                      <LuDownload></LuDownload>
                    </a>
                  </IconButton>
                </ButtonGroup>
                {asset.type && (
                  <Text fontSize={"xs"} fontWeight={"light"}>
                    {asset.type}
                  </Text>
                )}
              </HStack>
            </DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Stack>
  );
}
