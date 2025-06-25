import {
  Box,
  FileUpload,
  Icon,
  SimpleGrid,
  Tabs,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  LuInfo,
  LuMousePointerClick,
  LuSearch,
  LuUpload,
} from "react-icons/lu";
import type { StacCollection, StacLink } from "stac-ts";
import Search from "./stac/search";
import type { StacValue } from "./stac/types";
import { Value } from "./stac/value";
import { toaster } from "./ui/toaster";

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
  const { collections, error } = useCollections(value);
  // We make this a hook b/c we'll eventually want to fetch them from the root (for collections)
  const searchLinks = useSearchLinks(value);

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

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while fetching collections",
        description: error,
      });
    }
  }, [error]);

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
          <Tabs.Trigger value="search" disabled={searchLinks.length == 0}>
            <LuSearch></LuSearch>
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
                collections={collections}
                stacGeoparquetPath={stacGeoparquetPath}
                setHref={setHref}
                setPicked={setPicked}
              ></Value>
            )}
          </Tabs.Content>
          <Tabs.Content value="search">
            <Search collections={collections} links={searchLinks}></Search>
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

function useSearchLinks(value?: StacValue) {
  const [searchLinks, setSearchLinks] = useState<StacLink[]>([]);

  useEffect(() => {
    setSearchLinks(
      (value &&
        value.links &&
        value.links.filter((link) => link.rel == "search")) ||
        [],
    );
  }, [value, setSearchLinks]);

  return searchLinks;
}

function useCollections(value?: StacValue) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [collections, setCollections] = useState<StacCollection[]>([]);

  useEffect(() => {
    const link = value?.links?.find((link) => link.rel == "data");
    if (link) {
      setLoading(true);
      (async () => {
        let nextHref = link.href;
        let fetchedCollections: StacCollection[] = [];
        while (true) {
          const response = await fetch(nextHref);
          if (response.ok) {
            const data = await response.json();
            fetchedCollections = [
              ...fetchedCollections,
              ...(data.collections ?? []),
            ];
            const nextLink = (data.links ?? []).find(
              (link: StacLink) => link.rel == "next",
            );
            if (nextLink && nextLink.href != nextHref) {
              nextHref = nextLink.href;
            } else {
              break;
            }
          } else {
            setError(
              "Error while fetching " +
                nextHref +
                ": " +
                (await response.text()),
            );
            break;
          }
        }
        setCollections(fetchedCollections);
      })();
      setLoading(false);
    }
  }, [value]);

  return { collections, loading, error };
}
