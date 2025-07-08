import { Button, Heading, HStack, IconButton, Stack } from "@chakra-ui/react";
import { LuExternalLink, LuFocus } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { useFitBbox } from "../../hooks";
import { Assets } from "./asset";
import Value, {
  SelfLinkButtons as BaseSelfLinkButtons,
  type SelfLinkButtonsProps,
} from "./value";

export default function Item({ item }: { item: StacItem }) {
  const fitBbox = useFitBbox();

  return (
    <Stack>
      <Value
        value={item}
        type={"Item"}
        selfLinkButtonsType={SelfLinkButtons}
      ></Value>

      <HStack>
        {item.bbox && (
          <IconButton
            size={"xs"}
            variant={"surface"}
            onClick={() => item.bbox && fitBbox(item.bbox)}
          >
            <LuFocus></LuFocus>
          </IconButton>
        )}
      </HStack>

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
