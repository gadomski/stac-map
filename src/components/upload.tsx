import {
  Box,
  FileUpload,
  Icon,
  type UseFileUploadReturn,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";

export default function Upload({
  fileUpload,
}: {
  fileUpload: UseFileUploadReturn;
}) {
  return (
    <FileUpload.RootProvider alignItems="stretch" value={fileUpload} pb={4}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone bg={"bg.muted/60"}>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.RootProvider>
  );
}
