import { Center, SimpleGrid, Spinner, Tabs } from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuInfo, LuMousePointerClick } from "react-icons/lu";
import { useAppState, useAppStateDispatch } from "./components/hooks";
import { useStacValue } from "./components/stac/hooks";
import { getStacLayers } from "./components/stac/layers";
import { getBbox } from "./components/stac/utils";
import { toaster } from "./components/ui/toaster";
import Value from "./components/value";

export default function Panel({
  href,
  setLayers,
}: {
  href: string;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const { value, loading, error } = useStacValue(href);
  const [tabValue, setTabValue] = useState("value");
  const [valueLayers, setValueLayers] = useState<Layer[]>([]);
  const [pickedLayers, setPickedLayers] = useState<Layer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<Layer[]>([]);
  const { picked, selected } = useAppState();
  const dispatch = useAppStateDispatch();

  useEffect(() => {
    setLayers([...pickedLayers, ...selectedLayers, ...valueLayers]);
  }, [valueLayers, pickedLayers, setLayers, selectedLayers]);

  useEffect(() => {
    setTabValue("value");
    dispatch({ type: "pick" });
  }, [value, setTabValue, dispatch]);

  useEffect(() => {
    if (picked) {
      setPickedLayers(getStacLayers(picked));
      const bbox = getBbox(picked);
      if (bbox) {
        dispatch({ type: "fit-bbox", bbox });
      }
      setTabValue("picked");
    } else {
      setPickedLayers([]);
    }
  }, [picked, dispatch, setPickedLayers, setTabValue]);

  useEffect(() => {
    setSelectedLayers(selected.map((value) => getStacLayers(value)).flat());
  }, [selected, setSelectedLayers]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while loading STAC value",
        description: error,
      });
    }
  }, [error]);

  return (
    <SimpleGrid columns={3} gap={4}>
      <Tabs.Root
        bg={"bg.muted"}
        rounded={4}
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
        pointerEvents={"auto"}
        overflow={"scroll"}
        maxH={"80dvh"}
      >
        <Tabs.List>
          <Tabs.Trigger value="value">
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="picked" disabled={!picked}>
            <LuMousePointerClick></LuMousePointerClick>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup py={2} px={4}>
          <Tabs.Content value="value">
            {loading && (
              <Center>
                <Spinner></Spinner>
              </Center>
            )}
            {value && <Value value={value} setLayers={setValueLayers}></Value>}
          </Tabs.Content>
          <Tabs.Content value="picked">
            {picked && (
              <Value value={picked} setLayers={setPickedLayers}></Value>
            )}
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </SimpleGrid>
  );
}
