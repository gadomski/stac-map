import {
  Box,
  FileUpload,
  Icon,
  SimpleGrid,
  Tabs,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuInfo, LuUpload } from "react-icons/lu";
import Value from "./stac/value";

export function Panel({
  href,
  setHref,
  fileUpload,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
  fileUpload: UseFileUploadReturn;
}) {
  const [tabValue, setTabValue] = useState("upload");

  useEffect(() => {
    if (href.length > 0) {
      setTabValue("value");
    }
  }, [href]);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length == 1) {
      setHref(fileUpload.acceptedFiles[0].name);
    }
  }, [fileUpload.acceptedFiles, setHref]);

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
          <Tabs.Trigger value="value" disabled={href.length === 0}>
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="upload">
            <LuUpload></LuUpload>
          </Tabs.Trigger>
        </Tabs.List>
        <Box px={4} pb={4}>
          <Tabs.Content value="value">
            <Value
              href={href}
              setHref={setHref}
              fileUpload={fileUpload}
            ></Value>
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
