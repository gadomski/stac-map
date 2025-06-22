import {
  Box,
  Button,
  FileUpload,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  useFileUpload,
  Wrap,
} from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState } from "react";
import {
  LuExternalLink,
  LuFilter,
  LuInfo,
  LuSearch,
  LuUpload,
} from "react-icons/lu";
import type { StacCatalog, StacCollection, StacItem } from "stac-ts";
import { useStac, useStacDispatch } from "./stac/hooks";
import type { StacItemCollection, StacValue } from "./stac/types";

function Catalog({ catalog }: { catalog: StacCatalog }) {
  return <Stack></Stack>;
}

function Collection({ collection }: { collection: StacCollection }) {
  return <></>;
}

function Item({ item }: { item: StacItem }) {
  return <></>;
}

function ItemCollection({
  itemCollection,
}: {
  itemCollection: StacItemCollection;
}) {
  return <></>;
}

function StacBrowserButton({ href }: { href: string }) {
  const stacBrowserHref = `https://radiantearth.github.io/stac-browser/#/external/${href.replace(
    /^https?:\/\//i,
    ""
  )}`;
  return (
    <Button asChild colorPalette={"teal"}>
      <a href={stacBrowserHref}>
        Open in STAC Browser <LuExternalLink></LuExternalLink>
      </a>
    </Button>
  );
}

function Value({ value }: { value: StacValue }) {
  // @ts-expect-error Items don't have a title.
  const title: string = value.title || value.id || "missing id";
  const selfLink = value.links?.find((link) => link.rel == "self");
  let detail;
  switch (value.type) {
    case "Catalog":
      detail = <Catalog catalog={value}></Catalog>;
      break;
    case "Collection":
      detail = <Collection collection={value}></Collection>;
      break;
    case "Feature":
      detail = <Item item={value}></Item>;
      break;
    case "FeatureCollection":
      detail = <ItemCollection itemCollection={value}></ItemCollection>;
      break;
  }
  return (
    <>
      <Stack mb={4} gap={0}>
        <Heading fontSize={"xs"} fontWeight={"lighter"} my={0}>
          {value.type}
          {value.title !== undefined &&
            typeof value.id === "string" &&
            `: ${value.id}`}
        </Heading>
        <Heading mb={2}>{title}</Heading>
        {typeof value.description === "string" && (
          <Text lineClamp={3} fontSize={"md"} fontWeight={"light"}>
            {value.description}
          </Text>
        )}
      </Stack>
      {selfLink && (
        <Wrap>
          <Button asChild variant={"surface"}>
            <a href={selfLink.href}>
              Open <LuExternalLink></LuExternalLink>
            </a>
          </Button>
          <StacBrowserButton href={selfLink.href}></StacBrowserButton>
        </Wrap>
      )}
      {detail}
    </>
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
      (async () => {
        if (file.name.endsWith(".parquet")) {
          if (db) {
            const buffer = await file.arrayBuffer();
            // TODO do we need to clean up, eventually?
            db.registerFileBuffer(file.name, new Uint8Array(buffer));
            dispatch({ type: "set-href", href: file.name });
          }
        } else {
          const text = await file.text();
          const value = JSON.parse(text);
          dispatch({ type: "set-href" });
          dispatch({ type: "set-value", value });
        }
      })();
    }
  }, [fileUpload.acceptedFiles, db, dispatch]);

  useEffect(() => {
    if (value) {
      setTabValue("value");
    }
  }, [value]);

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
          <Tabs.Trigger value="value" disabled={value === undefined}>
            <LuInfo></LuInfo>
          </Tabs.Trigger>
          <Tabs.Trigger value="search" disabled={true}>
            <LuSearch></LuSearch>
          </Tabs.Trigger>
          <Tabs.Trigger value="filter" disabled={true}>
            <LuFilter></LuFilter>
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
