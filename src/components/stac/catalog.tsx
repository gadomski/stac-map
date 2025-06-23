import { Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuFolder } from "react-icons/lu";
import type { StacCatalog, StacCollection, StacLink } from "stac-ts";
import { CollectionCard } from "./collection";
import { ValueInfo } from "./shared";

function Collections({
  href,
  setHref,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const { collections, loading, error } = useCollections(href);

  if (error) {
    <Text colorPalette={"red"}>Error when loading collections: {error}</Text>;
  } else if (loading) {
    return <Skeleton h={200}></Skeleton>;
  } else {
    return (
      <Stack>
        {collections.map((collection) => (
          <CollectionCard
            collection={collection}
            setHref={setHref}
            key={collection.id}
          ></CollectionCard>
        ))}
      </Stack>
    );
  }
}

export function Catalog({
  catalog,
  setHref,
}: {
  catalog: StacCatalog;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const collectionsHref = catalog.links.find(
    (link) => link.rel == "data"
  )?.href;
  return (
    <Stack>
      <ValueInfo
        type={"Catalog"}
        value={catalog}
        id={catalog.id}
        icon={<LuFolder></LuFolder>}
        title={catalog.title}
        description={catalog.description}
      ></ValueInfo>

      {collectionsHref && (
        <>
          <Heading size={"md"} mt={8}>
            Collections
          </Heading>
          <Collections href={collectionsHref} setHref={setHref}></Collections>
        </>
      )}
    </Stack>
  );
}

function useCollections(href: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [collections, setCollections] = useState<StacCollection[]>([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      let nextHref = href;
      let fetchedCollections: StacCollection[] = [];
      while (true) {
        const response = await fetch(nextHref);
        if (response.ok) {
          const data = await response.json();
          fetchedCollections = [
            ...fetchedCollections,
            ...(data.collections ?? []),
          ];
          const nextLink = (data.links ?? []).find(
            (link: StacLink) => link.rel == "next"
          );
          if (nextLink && nextLink.href != nextHref) {
            nextHref = nextLink.href;
          } else {
            break;
          }
        } else {
          setError(
            "Error while fetching " + href + ": " + (await response.text())
          );
          break;
        }
      }
      setCollections(fetchedCollections);
      setLoading(false);
    })();
  }, [href]);

  return { collections, loading, error };
}
