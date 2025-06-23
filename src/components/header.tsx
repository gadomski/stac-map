import {
  Button,
  HStack,
  Input,
  InputGroup,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuSearch } from "react-icons/lu";

const EXAMPLES = [
  ["NASA VEDA", "https://openveda.cloud/api/stac"],
  ["eoAPI DevSeed", "https://stac.eoapi.dev/"],
  [
    "Microsoft Planetary Computer",
    "https://planetarycomputer.microsoft.com/api/stac/v1",
  ],
  ["Earth Search by Element 84", "https://earth-search.aws.element84.com/v1"],
  [
    "Simple item",
    "https://raw.githubusercontent.com/radiantearth/stac-spec/refs/heads/master/examples/simple-item.json",
  ],
];

export default function Header({
  href,
  setHref,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const [value, setValue] = useState(href);

  useEffect(() => {
    setValue(href);
  }, [href]);

  return (
    <HStack py={4} pointerEvents={"auto"}>
      <InputGroup
        w="full"
        startElement={<LuSearch></LuSearch>}
        as={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          setHref(value);
        }}
      >
        <Input
          flex={1}
          variant={"subtle"}
          rounded={4}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        ></Input>
      </InputGroup>
      <Menu.Root onSelect={(details) => setHref(details.value)}>
        <Menu.Trigger asChild>
          <Button variant={"surface"}>Examples</Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {EXAMPLES.map(([text, href], index) => (
                <Menu.Item key={"example-" + index} value={href}>
                  {text}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </HStack>
  );
}
