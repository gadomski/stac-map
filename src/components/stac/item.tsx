import { Button, Heading, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuExternalLink } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { useAppDispatch, useFitBbox } from "../../hooks";
import { Assets } from "./asset";
import { getItemLayer } from "./layers";
import { sanitizeBbox } from "./utils";
import Value, {
  SelfLinkButtons as BaseSelfLinkButtons,
  type SelfLinkButtonsProps,
} from "./value";

export default function Item({
  item,
  map = true,
}: {
  item: StacItem;
  map?: boolean;
}) {
  const fitBbox = useFitBbox();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (item && map) {
      dispatch({ type: "set-layer", layer: getItemLayer(item) });
    }
  }, [item, dispatch, map]);

  useEffect(() => {
    if (item.bbox && map) {
      fitBbox(sanitizeBbox(item.bbox));
    }
  }, [item.bbox, fitBbox, map]);

  return (
    <Stack>
      <Value
        value={item}
        type={"Item"}
        selfLinkButtonsType={SelfLinkButtons}
      ></Value>

      <Heading size={"md"} mt={4}>
        Assets
      </Heading>
      <Assets assets={item.assets}></Assets>
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
