import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuExternalLink } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { useAppDispatch, useFitBbox } from "../../hooks";
import { AssetCard } from "./asset";
import { getItemLayer } from "./layers";
import { sanitizeBbox } from "./utils";
import Value, {
  SelfLinkButtons as BaseSelfLinkButtons,
  type SelfLinkButtonsProps,
} from "./value";

export default function Item({ item }: { item: StacItem }) {
  const fitBbox = useFitBbox();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (item) {
      dispatch({ type: "set-layer", layer: getItemLayer(item) });
    }
  }, [item, dispatch]);

  useEffect(() => {
    if (item.bbox) {
      fitBbox(sanitizeBbox(item.bbox));
    }
  }, [item.bbox, fitBbox]);

  return (
    <Stack>
      <Value
        value={item}
        type={"Item"}
        selfLinkButtonsType={SelfLinkButtons}
      ></Value>

      <SimpleGrid columns={2} gap={2} my={2}>
        {Object.entries(item.assets).map(([key, asset]) => (
          <AssetCard
            key={item.id + key}
            assetKey={key}
            asset={asset}
          ></AssetCard>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function SelfLinkButtons({ link, children }: SelfLinkButtonsProps) {
  return (
    <BaseSelfLinkButtons link={link}>
      <Button asChild variant={"surface"} size={"xs"}>
        <a
          href={"https://titiler.xyz/stac/viewer?url=" + link.href}
          target="_blank"
        >
          TiTiler <LuExternalLink></LuExternalLink>
        </a>
      </Button>
      {children}
    </BaseSelfLinkButtons>
  );
}
