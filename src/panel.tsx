import { Tabs, type UseFileUploadReturn } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuInfo, LuSearch, LuUpload } from "react-icons/lu";
import Loading from "./components/loading";
import { useStacValue } from "./components/stac/hooks";
import Search from "./components/stac/search";
import Value from "./components/stac/value";
import { toaster } from "./components/ui/toaster";
import Upload from "./components/upload";
import { useLayersDispatch, useSelectedDispatch } from "./hooks";

export default function Panel({
  href,
  fileUpload,
}: {
  href: string;
  fileUpload: UseFileUploadReturn;
}) {
  const { value, parquetPath, loading, error } = useStacValue(href, fileUpload);
  const [tabValue, setTabValue] = useState("value");
  const layersDispatch = useLayersDispatch();
  const selectedDispatch = useSelectedDispatch();

  useEffect(() => {
    layersDispatch({ type: "set-value", layer: null });
    layersDispatch({ type: "set-selected", layer: null });
    selectedDispatch({ type: "deselect-all-collections" });
    selectedDispatch({ type: "select-stac-geoparquet-id", id: null });
  }, [layersDispatch, selectedDispatch, href]);

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
        <Tabs.Trigger value="search" disabled={!value}>
          <LuSearch></LuSearch>
        </Tabs.Trigger>
        <Tabs.Trigger value="upload">
          <LuUpload></LuUpload>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.ContentGroup overflow={"scroll"} maxH={"80dvh"} px={4} pb={4}>
        <Tabs.Content value="value">
          {(loading && <Loading></Loading>) ||
            (value && <Value value={value} parquetPath={parquetPath}></Value>)}
        </Tabs.Content>
        <Tabs.Content value="search">
          {value && <Search href={href} value={value}></Search>}
        </Tabs.Content>
        <Tabs.Content value="upload">
          <Upload fileUpload={fileUpload}></Upload>
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
