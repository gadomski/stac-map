import {
  Card,
  DataList,
  Heading,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import type { StacItem } from "stac-ts";

export default function Item({ item }: { item: StacItem }) {
  return (
    <Stack>
      <DataList.Root orientation={"horizontal"} size={"sm"}>
        <DataList.Item>
          <DataList.ItemLabel>ID</DataList.ItemLabel>
          <DataList.ItemValue>{item.id}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>STAC version</DataList.ItemLabel>
          <DataList.ItemValue>{item.stac_version}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>

      <Heading size={"sm"} mt={4}>
        Assets
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 1, lg: 2 }} gap={2}>
        {Object.entries(item.assets).map(([key, asset]) => {
          // TODO make this configurable
          const showImage =
            asset.type && ["image/jpeg", "image/png"].includes(asset.type);
          return (
            <Card.Root key={item.id + key} size={"sm"}>
              <Card.Header>{key}</Card.Header>
              <Card.Body>
                {asset.title && <Card.Title>{asset.title}</Card.Title>}
                {asset.description && (
                  <Card.Description>{asset.description}</Card.Description>
                )}
                {showImage && <Image src={asset.href} maxH={200} />}
              </Card.Body>
              <Card.Footer>
                <Link href={asset.href}>
                  <IconButton variant={"plain"} size={"sm"}>
                    <LuExternalLink></LuExternalLink>
                  </IconButton>
                </Link>
              </Card.Footer>
            </Card.Root>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
