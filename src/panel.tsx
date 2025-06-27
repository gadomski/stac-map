import { GridItem, SimpleGrid, Stack, Tabs, Text } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { LuInfo } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { useAppState, useAppStateDispatch } from "./components/hooks";
import Info from "./components/info";
import {
  useStacCollections,
  useStacLayers,
  useStacValue,
} from "./components/stac/hooks";
import type { StacValue } from "./components/stac/types";
import { getBbox } from "./components/stac/utils";

export default function Panel({
  href,
  setHref,
  setLayers,
}: {
  href: string | undefined;
  setHref: Dispatch<SetStateAction<string | undefined>>;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [stacTabs, setStacTabs] = useState<Tab[]>([]);
  const [value, setValue] = useState<StacValue | undefined>();
  const [collections, setCollections] = useState<
    StacCollection[] | undefined
  >();
  const [valueLayers, setValueLayers] = useState<Layer[]>([]);
  const [pickedLayers, setPickedLayers] = useState<Layer[]>([]);
  const { picked } = useAppState();
  const dispatch = useAppStateDispatch();

  useEffect(() => {
    if (value) {
      setStacTabs([
        {
          value: "info",
          content: (
            <Info
              value={value}
              collections={collections}
              setHref={setHref}
              setLayers={setLayers}
            ></Info>
          ),
        },
      ]);
    } else {
      setStacTabs([]);
    }
  }, [value, collections, setHref, setLayers]);

  useEffect(() => {
    setLayers([...pickedLayers, ...valueLayers]);
  }, [valueLayers, pickedLayers, setLayers]);

  useEffect(() => {
    if (picked) {
      const bbox = getBbox(picked);
      if (bbox) {
        dispatch({ type: "fit-bbox", bbox: bbox });
      }
    }
  }, [picked, dispatch]);

  return (
    <SimpleGrid columns={3} gap={4}>
      <Tabs.Root
        bg={"bg.muted"}
        rounded={4}
        defaultValue={"info"}
        pointerEvents={"auto"}
        overflow={"scroll"}
        maxH={"80dvh"}
      >
        <Tabs.List>
          <Tabs.Trigger value="info">
            <LuInfo></LuInfo>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup py={2} px={4}>
          {stacTabs.map((stacTab) => (
            <Tabs.Content value={stacTab.value} key={stacTab.value}>
              {stacTab.content}
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
      <GridItem colSpan={2}>
        <Stack fontSize={"xs"} fontWeight={"light"} py={2}>
          {href && <Value href={href} setValue={setValue}></Value>}
          {value && (
            <Collections
              value={value}
              setCollections={setCollections}
            ></Collections>
          )}
          {value && collections && (
            <ValueLayers
              value={value}
              collections={collections}
              setLayers={setValueLayers}
            ></ValueLayers>
          )}
          {picked && (
            <ValueLayers
              value={picked}
              setLayers={setPickedLayers}
            ></ValueLayers>
          )}
        </Stack>
      </GridItem>
    </SimpleGrid>
  );
}

interface Tab {
  value: string;
  content: ReactNode;
}

function Value({
  href,
  setValue,
}: {
  href: string;
  setValue: Dispatch<SetStateAction<StacValue | undefined>>;
}) {
  const { value, loading, error } = useStacValue(href);

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  if (error) {
    return (
      <Text color={"red"}>
        Error while getting {href}: {error}
      </Text>
    );
  } else if (loading) {
    return <Text>Getting {href}...</Text>;
  }
}

function ValueLayers({
  value,
  collections,
  setLayers,
}: {
  value: StacValue;
  collections?: StacCollection[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const { layers } = useStacLayers(value, collections);

  useEffect(() => {
    setLayers(layers);
  }, [layers, setLayers]);

  return null;
}

function Collections({
  value,
  setCollections,
}: {
  value: StacValue;
  setCollections: Dispatch<SetStateAction<StacCollection[] | undefined>>;
}) {
  const { collections, loading, error } = useStacCollections(value);

  useEffect(() => {
    setCollections(collections);
  }, [collections, setCollections]);

  if (error) {
    return <Text color={"red"}>Error while getting collections: {error}</Text>;
  } else if (loading) {
    return <Text>Getting collections...</Text>;
  }
}
