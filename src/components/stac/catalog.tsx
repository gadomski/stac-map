import { Stack } from "@chakra-ui/react";
import { LuFolder } from "react-icons/lu";
import type { StacCatalog } from "stac-ts";
import { ValueInfo } from "./shared";

export function Catalog({ catalog }: { catalog: StacCatalog }) {
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
    </Stack>
  );
}
