import { Heading, Link, List, Stack } from "@chakra-ui/react";
import type { StacCollection } from "stac-ts";
import useStacMap from "../hooks/stac-map";

export default function Collections({
  collections,
}: {
  collections: StacCollection[];
}) {
  return (
    <Stack>
      <Heading size={"md"}>Collections</Heading>
      <List.Root variant={"plain"} gap={1}>
        {collections.map((collection) => (
          <CollectionListItem
            key={collection.id}
            collection={collection}
          ></CollectionListItem>
        ))}
      </List.Root>
    </Stack>
  );
}

function CollectionListItem({ collection }: { collection: StacCollection }) {
  const { setHref } = useStacMap();
  const selfHref = collection.links.find((link) => link.rel === "self")?.href;

  return (
    <List.Item>
      <Link onClick={() => selfHref && setHref(selfHref)}>
        {collection.title || collection.id}
      </Link>
    </List.Item>
  );
}
