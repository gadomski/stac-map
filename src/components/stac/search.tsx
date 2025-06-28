import { Accordion, Span } from "@chakra-ui/react";
import { NaturalLanguageCollectionSearch } from "./natural-language";
import type { StacValue } from "./types";

export default function Search({
  href,
  value,
}: {
  href: string;
  value: StacValue;
}) {
  const naturalLanguageCollectionSearch = value.type === "Catalog" && (
    <NaturalLanguageCollectionSearch
      href={href}
    ></NaturalLanguageCollectionSearch>
  );
  return (
    <Accordion.Root
      collapsible
      defaultValue={[
        (naturalLanguageCollectionSearch && "natural-language-collection") ||
          "",
      ]}
      variant={"enclosed"}
    >
      {naturalLanguageCollectionSearch && (
        <Accordion.Item value="natural-language-collection">
          <Accordion.ItemTrigger>
            <Span flex="1">Natural language collection search</Span>
            <Accordion.ItemIndicator></Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent py={4}>
            {naturalLanguageCollectionSearch}
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
    </Accordion.Root>
  );
}
