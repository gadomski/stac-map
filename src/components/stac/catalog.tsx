import { Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import type { StacCatalog } from "stac-ts";
import Loading from "../loading";
import { toaster } from "../ui/toaster";
import { Collections } from "./collection";
import { useStacCollections } from "./hooks";
import Value from "./value";

export default function Catalog({ catalog }: { catalog: StacCatalog }) {
  const { collections, loading, error } = useStacCollections(catalog);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while fetching collections",
        description: error,
      });
    }
  }, [error]);

  return (
    <Stack gap={8}>
      <Value value={catalog}></Value>
      {loading && <Loading></Loading>}
      {!loading && collections && (
        <Collections collections={collections}></Collections>
      )}
    </Stack>
  );
}
