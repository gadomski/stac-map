import { Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuInfo, LuSearch, LuUpload } from "react-icons/lu";
import Loading from "./components/loading";
import Catalog from "./components/stac/catalog";
import Collection from "./components/stac/collection";
import Item from "./components/stac/item";
import ItemCollection from "./components/stac/item-collection";
import Search from "./components/stac/search";
import type { StacValue } from "./components/stac/types";
import Upload from "./components/upload";
import { useStacMap } from "./hooks";

export default function Panel() {
  const { href, value, valueLoading, fileUpload } = useStacMap();
  const [tabValue, setTabValue] = useState("value");
  const [enableSearch, setEnableSearch] = useState(false);

  useEffect(() => {
    if (value) {
      setTabValue("value");
      setEnableSearch(
        value.type === "Catalog" || // Natural language
          value.links?.find((link) => link.rel == "search") !== undefined, // Item search
      );
    } else {
      setTabValue("upload");
      setEnableSearch(false);
    }
  }, [value]);

  return (
    <Tabs.Root
      value={tabValue}
      onValueChange={(e) => setTabValue(e.value)}
      bg={"bg.muted"}
      rounded={4}
    >
      <Tabs.List>
        <Tabs.Trigger value="value" disabled={!value}>
          <LuInfo></LuInfo>
        </Tabs.Trigger>
        <Tabs.Trigger value="search" disabled={!enableSearch}>
          <LuSearch></LuSearch>
        </Tabs.Trigger>
        <Tabs.Trigger value="upload">
          <LuUpload></LuUpload>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.ContentGroup overflow={"scroll"} maxH={"80dvh"} px={4} pb={4}>
        <Tabs.Content value="value">
          {(valueLoading && <Loading></Loading>) || (value && getValue(value))}
        </Tabs.Content>
        <Tabs.Content value="search">
          {href && value && <Search value={value} href={href}></Search>}
        </Tabs.Content>
        <Tabs.Content value="upload">
          <Upload fileUpload={fileUpload}></Upload>
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}

function getValue(value: StacValue) {
  switch (value.type) {
    case "Catalog":
      return <Catalog catalog={value}></Catalog>;
    case "Collection":
      return <Collection collection={value}></Collection>;
    case "Feature":
      return <Item item={value}></Item>;
    case "FeatureCollection":
      return <ItemCollection itemCollection={value}></ItemCollection>;
  }
}
