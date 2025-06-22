import {
  Button,
  Group,
  HStack,
  Input,
  Menu,
  Portal,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { useState } from "react";
import { useStacDispatch } from "./stac/hooks";
import { ColorModeButton } from "./ui/color-mode";

export default function Header() {
  const [href, setHref] = useState<string>("");
  const dispatch = useStacDispatch();

  async function onSelectExample(details: MenuSelectionDetails) {
    setHref(details.value);
    dispatch({ type: "set-href", href: details.value });
  }

  return (
    <HStack spaceX={2} pointerEvents={"auto"}>
      <Group
        attached
        w={"full"}
        as={"form"}
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch({ type: "set-href", href });
        }}
      >
        <Input
          variant={"subtle"}
          flex={"1"}
          value={href}
          onChange={(e) => setHref(e.currentTarget.value)}
        ></Input>
        <Button
          variant={"outline"}
          bg={"bg.subtle"}
          type={"submit"}
          hideBelow={"md"}
        >
          Load
        </Button>
      </Group>
      <Menu.Root onSelect={onSelectExample}>
        <Menu.Trigger asChild>
          <Button variant={"subtle"}>Examples</Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="https://stac.eoapi.dev/">
                eoAPI DevSeed STAC
              </Menu.Item>
              <Menu.Item value="https://planetarycomputer.microsoft.com/api/stac/v1">
                Microsoft Planetary Computer
              </Menu.Item>
              <Menu.Item value="https://raw.githubusercontent.com/developmentseed/labs-375-stac-geoparquet-backend/refs/heads/main/data/naip.parquet">
                Colorado NAIP
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ColorModeButton></ColorModeButton>
    </HStack>
  );
}
