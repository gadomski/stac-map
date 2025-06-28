import { useEffect } from "react";
import type { StacCatalog } from "stac-ts";
import Loading from "../loading";
import { toaster } from "../ui/toaster";
import { Collections } from "./collection";
import { useStacCollections } from "./hooks";

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

  if (loading) {
    return <Loading></Loading>;
  } else if (collections) {
    return <Collections collections={collections}></Collections>;
  }
}
