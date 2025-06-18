import {
  Container,
  FileUpload,
  HStack,
  IconButton,
  Input,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import { useStacGeoparquet } from "../hooks/stac-geoparquet";
import { ColorModeButton } from "./ui/color-mode";

export default function Header() {
  const fileUpload = useFileUpload({
    maxFiles: 1,
  });
  const { setFileUpload, duckDbLoading, duckDbError, path } =
    useStacGeoparquet();

  // The max files should only allow this to be called once
  useEffect(() => {
    fileUpload.acceptedFiles.forEach((file) => {
      setFileUpload(file);
    });
  }, [fileUpload, setFileUpload]);

  return (
    <Container py={2} mx={4}>
      <HStack spaceX={2}>
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
      <HStack spaceX={2} fontSize={"small"} mx={4} my={2}>
        {duckDbLoading && (
          <Text fontWeight={"light"}>DuckDB is loading...</Text>
        )}
        {duckDbError && (
          <Text fontWeight={"bold"}>
            An error occurred while loading DuckDB: {duckDbError.toString()}
          </Text>
        )}
      </HStack>
    </Container>
  );
}
