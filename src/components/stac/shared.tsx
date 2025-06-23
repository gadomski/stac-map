import { Heading, Stack, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

export function ValueInfo({
  type,
  id,
  title,
  description,
}: {
  type: string;
  icon: ReactNode;
  id: string;
  title?: string;
  description?: string;
}) {
  const heading = title || id;
  return (
    <Stack>
      <Text color={"fg.subtle"} fontSize={"small"}>
        {type}
      </Text>
      <Heading>{heading}</Heading>
      {description && <Text fontWeight={"light"}>{description}</Text>}
    </Stack>
  );
}
