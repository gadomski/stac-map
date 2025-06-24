import {
  Box,
  FileUpload,
  Icon,
  SimpleGrid,
  Tabs,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuInfo, LuMousePointerClick, LuUpload } from "react-icons/lu";
import type { StacValue } from "./stac/types";
import { Value } from "./stac/value";

export function Panel({
  setHref,
  fileUpload,
  value,
  stacGeoparquetPath,
}: {
  setHref: Dispatch<SetStateAction<string>>;
  fileUpload: UseFileUploadReturn;
  value?: StacValue;
  stacGeoparquetPath?: string;
}) {
  const [tabValue, setTabValue] = useState("upload");
  const [picked, setPicked] = useState<StacValue | undefined>();

  useEffect(() => {
    if (value) {
      setTabValue("value");
      setPicked(undefined);
    }
  }, [value]);

  useEffect(() => {
    if (picked) {
      setTabValue("picked");
    }
  }, [picked]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }}>
      <Tabs.Root
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
        bg={"bg.muted"}
        rounded={4}
        pointerEvents={"auto"}
        overflow={"scroll"}
        maxH={{ base: "40vh", md: "90vh" }}
      >
        <Tabs.List>
          <Tabs.Trigger value="value" disabled={value === undefined}>
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="picked" disabled={picked === undefined}>
            <LuMousePointerClick></LuMousePointerClick>
          </Tabs.Trigger>
          <Tabs.Trigger value="upload">
            <LuUpload></LuUpload>
          </Tabs.Trigger>
        </Tabs.List>
        <Box px={4} pb={4}>
          <Tabs.Content value="value">
            {value && (
              <Value
                value={value}
                stacGeoparquetPath={stacGeoparquetPath}
                setHref={setHref}
                setPicked={setPicked}
              ></Value>
            )}
          </Tabs.Content>
          <Tabs.Content value="picked">
            {picked && <Value value={picked} setHref={setHref}></Value>}
          </Tabs.Content>
          <Tabs.Content value="upload">
            <FileUpload.RootProvider alignItems={"stretch"} value={fileUpload}>
              <FileUpload.HiddenInput></FileUpload.HiddenInput>
              <FileUpload.Dropzone>
                <Icon>
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop a file here</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.RootProvider>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </SimpleGrid>
  );
}
