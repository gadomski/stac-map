import { Box, FileUpload, Icon, SimpleGrid, Tabs } from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LuInfo, LuUpload } from "react-icons/lu";
import Value from "./stac/value";

export function Panel({
  href,
  setHref,
}: {
  href: string;
  setHref: Dispatch<SetStateAction<string>>;
}) {
  const [tabValue, setTabValue] = useState("upload");

  useEffect(() => {
    if (href.length > 0) {
      setTabValue("value");
    }
  }, [href]);

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
          <Tabs.Trigger value="value">
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="upload">
            <LuUpload></LuUpload>
          </Tabs.Trigger>
        </Tabs.List>
        <Box px={4} pb={4}>
          <Tabs.Content value="value">
            <Value href={href} setHref={setHref}></Value>
          </Tabs.Content>
          <Tabs.Content value="upload">
            <FileUpload.Root alignItems={"stretch"}>
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
            </FileUpload.Root>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </SimpleGrid>
  );
}
