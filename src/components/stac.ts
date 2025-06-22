import type { StacCatalog, StacCollection, StacItem, StacLink } from "stac-ts";
import { toaster } from "./ui/toaster";

export type StacValue =
  | StacCatalog
  | StacCollection
  | StacItem
  | StacItemCollection;

export type StacItemCollection = {
  type: "FeatureCollection";
  id?: string;
  title?: string;
  features: StacItem[];
  links: StacLink[];
};

export async function getStac(href: string) {
  try {
    const response = await fetch(href, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (
        ["Feature", "Catalog", "Collection", "FeatureCollection"].includes(
          data.type
        )
      ) {
        return data;
      } else {
        toaster.create({
          type: "error",
          title: "Invalid STAC",
          description:
            "GET " + href + " has an invalid type field: " + data.type,
        });
      }
    }
  } catch (error) {
    toaster.create({
      type: "error",
      title: "Error getting STAC",
      // @ts-expect-error Don't want to type the error
      description: "GET " + href + ": " + error.toString(),
    });
  }
}
