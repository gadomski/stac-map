import { ActionBar, Button, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { useSelected } from "../hooks";

export function SelectedActionBar() {
  const { collectionIds } = useSelected();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (collectionIds.size > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [collectionIds]);
  return (
    <ActionBar.Root open={open}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {collectionIds.size} collection{collectionIds.size > 1 && "s"}{" "}
              selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator></ActionBar.Separator>
            <Button variant={"outline"} size={"sm"}>
              <LuX></LuX>
              Deselect all
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
