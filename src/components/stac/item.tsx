import { Button, Heading, Stack } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import type { StacItem } from "stac-ts";
import { Assets } from "./asset";
import Value, {
  SelfLinkButtons as BaseSelfLinkButtons,
  type SelfLinkButtonsProps,
} from "./value";

export default function Item({ item }: { item: StacItem }) {
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
