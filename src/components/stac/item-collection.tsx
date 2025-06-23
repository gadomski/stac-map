import { Stack } from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { ValueInfo } from "./shared";
import StacGeoparquet from "./stac-geoparquet";
import type { StacItemCollection } from "./types";

export function ItemCollection({
  itemCollection,
  stacGeoparquetPath,
}: {
  itemCollection: StacItemCollection;
  stacGeoparquetPath?: string;
}) {
  return (
    <Stack>
      <ValueInfo
        type={"Item collection"}
        value={itemCollection}
        id={itemCollection.id || "no id"}
        title={itemCollection.title}
        description={itemCollection.description}
        icon={<LuFiles></LuFiles>}
        hideJsonButton={stacGeoparquetPath !== undefined}
      ></ValueInfo>
      {stacGeoparquetPath && (
        <StacGeoparquet path={stacGeoparquetPath}></StacGeoparquet>
      )}
    </Stack>
  );
}
