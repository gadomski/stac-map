import {
  Button,
  FileUpload,
  Group,
  HStack,
  IconButton,
  Input,
  Menu,
  Portal,
  useFileUpload,
  type MenuSelectionDetails,
} from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, type FormEvent } from "react";
import { LuDownload, LuUpload } from "react-icons/lu";
import {
  useStacGeoparquet,
  useStacGeoparquetDispatch,
} from "./stac-geoparquet/hooks";
import { ColorModeButton } from "./ui/color-mode";

export default function Header() {
  const fileUpload = useFileUpload({
    maxFiles: 1,
  });
  const { db } = useDuckDb();
  const { path, table } = useStacGeoparquet();
  const dispatch = useStacGeoparquetDispatch();

  useEffect(() => {
    // This should always be true since we set maxFiles to 1
    if (fileUpload.acceptedFiles.length == 1) {
      const file = fileUpload.acceptedFiles[0];
      if (db) {
        (async () => {
          const buffer = await file.arrayBuffer();
          // TODO do we need to clean up, eventually?
          db.registerFileBuffer(file.name, new Uint8Array(buffer));
          dispatch({ type: "set-path", path: file.name });
        })();
      }
    }
  }, [fileUpload.acceptedFiles, db, dispatch]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // @ts-expect-error: Not going to bother getting the typing right on the event.
    const path = e.target[0].value;
    if (path) {
      dispatch({ type: "set-path", path });
    }
  }

  function onSelectExample(details: MenuSelectionDetails) {
    dispatch({ type: "set-path", path: details.value });
  }

  return (
    <HStack spaceX={2} pointerEvents={"auto"}>
      <Group attached w={"full"} as={"form"} onSubmit={onSubmit}>
        <Input
          variant={"subtle"}
          placeholder={
            path || "Provide the URL of a stac-geoparquet file or file glob"
          }
          flex={"1"}
        ></Input>
        <Button
          variant={"outline"}
          bg={"bg.subtle"}
          type={"submit"}
          hideBelow={"md"}
        >
          Load
        </Button>
      </Group>
      <Menu.Root onSelect={onSelectExample}>
        <Menu.Trigger asChild>
          <Button variant={"subtle"}>Examples</Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="https://raw.githubusercontent.com/developmentseed/labs-375-stac-geoparquet-backend/refs/heads/main/data/naip.parquet">
                Colorado NAIP
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <FileUpload.RootProvider unstyled={true} value={fileUpload}>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <IconButton variant="ghost">
            <LuUpload />
          </IconButton>
        </FileUpload.Trigger>
      </FileUpload.RootProvider>
      <IconButton variant={"ghost"} disabled={table === undefined}>
        <LuDownload></LuDownload>
      </IconButton>
      <ColorModeButton></ColorModeButton>
    </HStack>
  );
}
