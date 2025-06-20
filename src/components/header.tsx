import {
  FileUpload,
  HStack,
  IconButton,
  Input,
  useFileUpload,
} from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect } from "react";
import { LuUpload } from "react-icons/lu";
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
  const { path } = useStacGeoparquet();
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

  return (
    <HStack spaceX={2} pointerEvents={"auto"}>
      <Input
        variant={"subtle"}
        placeholder={
          path || "Provide the URL of a stac-geoparquet file or file glob"
        }
      ></Input>
      <FileUpload.RootProvider unstyled={true} value={fileUpload}>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <IconButton variant="ghost">
            <LuUpload />
          </IconButton>
        </FileUpload.Trigger>
      </FileUpload.RootProvider>
      <ColorModeButton></ColorModeButton>
    </HStack>
  );
}
