import {
  CloseButton,
  Code,
  Dialog,
  IconButton,
  Portal,
  type IconButtonProps,
} from "@chakra-ui/react";
import { LuSearchCode } from "react-icons/lu";
import { Tooltip } from "./ui/tooltip";

interface IRawJsonDialogButton extends IconButtonProps {
  title: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function RawJsonDialogButton({
  title,
  value,
  ...rest
}: IRawJsonDialogButton) {
  return (
    <Dialog.Root scrollBehavior={"inside"} size={"xl"}>
      <Dialog.Trigger>
        <Tooltip content="Show raw JSON in a dialog">
          <IconButton {...rest}>
            <LuSearchCode></LuSearchCode>
          </IconButton>
        </Tooltip>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <pre style={{ width: "100%" }}>
                <Code width={"100%"} p={2}>
                  {JSON.stringify(value, null, 2)}
                </Code>
              </pre>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
