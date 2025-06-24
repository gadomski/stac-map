import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { LuFiles } from "react-icons/lu";
import { ValueInfo } from "./shared";
import StacGeoparquet from "./stac-geoparquet";
import type { StacItemCollection, StacValue } from "./types";

export function ItemCollection({
  itemCollection,
  stacGeoparquetPath,
  setPicked,
}: {
  itemCollection: StacItemCollection;
  stacGeoparquetPath?: string;
  setPicked?: Dispatch<SetStateAction<StacValue | undefined>>;
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
        <StacGeoparquet
          path={stacGeoparquetPath}
          setPicked={setPicked}
        ></StacGeoparquet>
      )}
    </Stack>
  );
}
