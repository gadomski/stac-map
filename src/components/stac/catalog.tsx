import { Stack } from "@chakra-ui/react";
import type { StacCatalog } from "stac-ts";
import { useStacMap } from "../../hooks";
import { Collections } from "./collection";
import Value from "./value";

export default function Catalog({ catalog }: { catalog: StacCatalog }) {
  const { collections } = useStacMap();
  return (
    <Stack gap={8}>
      <Value value={catalog}></Value>
      {collections && <Collections collections={collections}></Collections>}
    </Stack>
  );
}
