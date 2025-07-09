import { Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuInfo, LuSearch, LuUpload } from "react-icons/lu";
import type { StacLink } from "stac-ts";
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
  const { href, value, valueIsPending, fileUpload } = useStacMap();
  const [tabValue, setTabValue] = useState("upload");
  const [enableSearch, setEnableSearch] = useState(false);
  const [itemSearchLinks, setItemSearchLinks] = useState<
    StacLink[] | undefined
  >();
  const [
    naturalLanguageCollectionSearchHref,
    setNaturalLanguageCollectionSearchHref,
  ] = useState<string | undefined>();

  useEffect(() => {
    if (value) {
      setTabValue("value");
      setItemSearchLinks(value.links?.filter((link) => link.rel == "search"));
      setNaturalLanguageCollectionSearchHref(
        (value.type === "Catalog" && href) || undefined,
      );
    }
  }, [href, value]);

  useEffect(() => {
    setEnableSearch(
      !!naturalLanguageCollectionSearchHref ||
        (!!itemSearchLinks && itemSearchLinks.length > 0),
    );
  }, [naturalLanguageCollectionSearchHref, itemSearchLinks]);

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
          {(valueIsPending && <Loading></Loading>) ||
            (value && getValue(value))}
        </Tabs.Content>
        <Tabs.Content value="search">
          <Search
            itemSearchLinks={itemSearchLinks}
            naturalLanguageCollectionSearchHref={
              naturalLanguageCollectionSearchHref
            }
          ></Search>
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
