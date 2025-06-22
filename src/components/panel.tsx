import {
  Box,
  FileUpload,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import { LuInfo, LuUpload } from "react-icons/lu";
import { useStac, useStacDispatch } from "./stac/hooks";
import type { StacValue } from "./stac/types";

function Value({ value }: { value: StacValue }) {
  // @ts-expect-error Items don't have a title.
  const title: string = value.title || value.id || "missing id";
  return (
    <Stack gap={0}>
      <Heading fontSize={"xs"} fontWeight={"lighter"}>
        {value.type}
      </Heading>
      <Heading>{title}</Heading>
      {value.title !== undefined && typeof value.id === "string" && (
        <Heading fontSize={"xs"} fontWeight={"lighter"}>
          {value.id}
        </Heading>
      )}
      {typeof value.description === "string" && (
        <Text lineClamp={3} fontSize={"md"} fontWeight={"light"}>
          {value.description}
        </Text>
      )}
    </Stack>
  );
}

export default function Panel() {
  const [tabValue, setTabValue] = useState<string | undefined>();
  const { value } = useStac();
  const fileUpload = useFileUpload({ maxFiles: 1 });
  const { db } = useDuckDb();
  const dispatch = useStacDispatch();

  useEffect(() => {
    // This should always be true since we set maxFiles to 1
    if (fileUpload.acceptedFiles.length == 1) {
      const file = fileUpload.acceptedFiles[0];
      if (db) {
        (async () => {
          const buffer = await file.arrayBuffer();
          // TODO do we need to clean up, eventually?
          db.registerFileBuffer(file.name, new Uint8Array(buffer));
          dispatch({ type: "set-href", href: file.name });
        })();
      }
    }
  }, [fileUpload.acceptedFiles, db, dispatch]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} my={2}>
      <Tabs.Root
        bg={"bg.muted"}
        pointerEvents={"auto"}
        defaultValue={"upload"}
        rounded={"sm"}
        overflow={"scroll"}
        maxH={{ base: "40vh", md: "90vh" }}
        pb={4}
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
      >
        <Tabs.List>
          <Tabs.Trigger value="value">
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="upload">
            <LuUpload></LuUpload>
          </Tabs.Trigger>
        </Tabs.List>
        <Box px={4}>
          <Tabs.Content value="value">
            {value && <Value value={value}></Value>}
          </Tabs.Content>
          <Tabs.Content value="upload">
            <FileUpload.RootProvider alignItems="stretch" value={fileUpload}>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone>
                <Icon size="md" color="fg.muted">
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
