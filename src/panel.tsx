import {
  Center,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Tabs,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  LuInfo,
  LuMousePointerBan,
  LuMousePointerClick,
  LuUpload,
} from "react-icons/lu";
import { useAppState, useAppStateDispatch } from "./components/hooks";
import { useStacLayersMultiple, useStacValue } from "./components/stac/hooks";
import { getBbox } from "./components/stac/utils";
import Value from "./components/stac/value";
import { toaster } from "./components/ui/toaster";
import Upload from "./components/upload";

export default function Panel({
  href,
  setLayers,
  fileUpload,
}: {
  href: string;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  fileUpload: UseFileUploadReturn;
}) {
  const { value, loading, error } = useStacValue(href, fileUpload);
  const [tabValue, setTabValue] = useState("value");
  const [valueLayers, setValueLayers] = useState<Layer[]>([]);
  const [pickedLayers, setPickedLayers] = useState<Layer[]>([]);
  const { picked, selected } = useAppState();
  const { layers: selectedLayers } = useStacLayersMultiple(selected);
  const dispatch = useAppStateDispatch();

  useEffect(() => {
    setLayers([...pickedLayers, ...selectedLayers, ...valueLayers]);
  }, [valueLayers, pickedLayers, setLayers, selectedLayers]);

  useEffect(() => {
    if (value) {
      setTabValue("value");
      const bbox = getBbox(value);
      if (bbox) {
        dispatch({ type: "fit-bbox", bbox });
      }
      dispatch({ type: "pick" });
    }
  }, [value, setTabValue, dispatch]);

  useEffect(() => {
    if (picked) {
      const bbox = getBbox(picked);
      if (bbox) {
        dispatch({ type: "fit-bbox", bbox });
      }
      setTabValue("picked");
    } else {
      setTabValue("value");
      setPickedLayers([]);
    }
  }, [picked, dispatch, setPickedLayers, setTabValue]);

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
    <Tabs.Root
      value={tabValue}
      onValueChange={(e) => setTabValue(e.value)}
      bg={"bg.muted"}
      rounded={4}
    >
      <Tabs.List>
        <Tabs.Trigger value="value">
          <LuInfo></LuInfo>
        </Tabs.Trigger>
        <Tabs.Trigger value="picked" disabled={!picked}>
          <LuMousePointerClick></LuMousePointerClick>
        </Tabs.Trigger>
        <Tabs.Trigger value="upload">
          <LuUpload></LuUpload>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.ContentGroup py={2} px={4} overflow={"scroll"} maxH={"80dvh"}>
        <Tabs.Content value="value">
          {loading && (
            <Center>
              <Spinner></Spinner>
            </Center>
          )}
          {value && (
            <Value href={href} value={value} setLayers={setValueLayers}></Value>
          )}
        </Tabs.Content>
        <Tabs.Content value="picked">
          {picked && (
            <Stack>
              <Value
                href={href}
                value={picked}
                setLayers={setPickedLayers}
              ></Value>
              <HStack>
                <IconButton
                  variant={"surface"}
                  onClick={() => dispatch({ type: "pick" })}
                >
                  <LuMousePointerBan></LuMousePointerBan>
                </IconButton>
              </HStack>
            </Stack>
          )}
        </Tabs.Content>
        <Tabs.Content value="upload">
          <Upload fileUpload={fileUpload}></Upload>
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
