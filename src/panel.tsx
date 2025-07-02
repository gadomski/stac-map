import {
  ActionBar,
  Alert,
  Button,
  IconButton,
  Portal,
  Tabs,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import type { Layer } from "@deck.gl/core";
import {
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { LuFocus, LuInfo, LuSearch, LuUpload, LuX } from "react-icons/lu";
import Loading from "./components/loading";
import { useStacValue } from "./components/stac/hooks";
import { getCollectionsLayer } from "./components/stac/layers";
import Search from "./components/stac/search";
import type { StacValue } from "./components/stac/types";
import { getCollectionsExtent, getValue } from "./components/stac/utils";
import { toaster } from "./components/ui/toaster";
import Upload from "./components/upload";
import {
  AppContext,
  AppDispatchContext,
  appReducer,
  type AppAction,
  type AppState,
} from "./context";
import { useAppDispatch, useFitBbox, useSelectedCollections } from "./hooks";

export default function Panel({
  href,
  fileUpload,
  setLayers,
}: {
  href: string;
  fileUpload: UseFileUploadReturn;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const { value, parquetPath, loading, error } = useStacValue(href, fileUpload);
  const [tabValue, setTabValue] = useState("value");
  const [state, dispatch] = useReducer(appReducer, {
    layer: null,
    collections: [],
    selectedCollectionIds: new Set<string>(),
  });

  useEffect(() => {
    dispatch({ type: "set-collections", collections: [] });
    dispatch({ type: "deselect-all-collections" });
  }, [value]);

  useEffect(() => {
    if (value) {
      setTabValue("value");
    }
  }, [value, setTabValue]);

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while loading STAC value",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    const layers = [];
    const selectedCollections = state.collections.filter((collection) =>
      state.selectedCollectionIds.has(collection.id),
    );
    if (selectedCollections.length > 0) {
      const layer = getCollectionsLayer(selectedCollections, true);
      layers.push(layer.clone({ id: "selected-collections" }));
    }
    if (state.layer) {
      layers.push(state.layer.clone({ id: "layer" }));
    }
    setLayers(layers);
  }, [state.layer, state.collections, state.selectedCollectionIds, setLayers]);

  return (
    <Provider state={state} dispatch={dispatch}>
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
              (value &&
                (getValue(value, parquetPath) || (
                  <InvalidStacValue
                    href={href}
                    value={value}
                  ></InvalidStacValue>
                )))}
          </Tabs.Content>
          <Tabs.Content value="search">
            {value && <Search href={href} value={value}></Search>}
          </Tabs.Content>
          <Tabs.Content value="upload">
            <Upload fileUpload={fileUpload}></Upload>
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
      <SelectedCollectionsActionBar></SelectedCollectionsActionBar>
    </Provider>
  );
}

function InvalidStacValue({ href, value }: { href: string; value: StacValue }) {
  return (
    <Alert.Root status={"error"}>
      <Alert.Indicator></Alert.Indicator>
      <Alert.Content>
        <Alert.Title>Invalid STAC value</Alert.Title>
        <Alert.Description>
          STAC value at {href} has an invalid type field: {value.type}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

function Provider({
  state,
  dispatch,
  children,
}: {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  children: ReactNode;
}) {
  return (
    <AppContext value={state}>
      <AppDispatchContext value={dispatch}>{children}</AppDispatchContext>
    </AppContext>
  );
}

function SelectedCollectionsActionBar() {
  const collections = useSelectedCollections();
  const fitBbox = useFitBbox();
  const dispatch = useAppDispatch();

  return (
    <ActionBar.Root open={collections.length > 0}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {collections.length} collection{collections.length > 1 && "s"}{" "}
              selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator></ActionBar.Separator>
            <IconButton
              variant={"outline"}
              size={"xs"}
              onClick={() => fitBbox(getCollectionsExtent(collections))}
            >
              <LuFocus></LuFocus>
            </IconButton>
            <Button
              size={"xs"}
              variant={"outline"}
              onClick={() => dispatch({ type: "deselect-all-collections" })}
            >
              <LuX></LuX> Deselect all
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
