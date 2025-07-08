import {
  Center,
  CloseButton,
  DataList,
  Field,
  Heading,
  Input,
  InputGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useFitBbox, useStacMap } from "../../hooks";
import { toaster } from "../ui/toaster";
import { useNaturalLanguageCollectionSearch } from "./hooks";
import { getCollectionsExtent } from "./utils";

export function NaturalLanguageCollectionSearch({ href }: { href: string }) {
  const [query, setQuery] = useState<string | undefined>();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setValue("");
        setQuery(undefined);
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

  return (
    <Stack gap={4}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(value);
        }}
      >
        <Field.Root>
          <InputGroup
            startElement={<LuSearch></LuSearch>}
            endElement={endElement}
          >
            <Input
              size={"sm"}
              placeholder="Find collections that..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            ></Input>
          </InputGroup>
          <Field.HelperText>
            Natural language collection search is experimental, and can be
            rather slow.
          </Field.HelperText>
        </Field.Root>
      </form>
      {query && <Results query={query} href={href}></Results>}
    </Stack>
  );
}

function Results({ query, href }: { query: string; href: string }) {
  const { results, isPending, error } = useNaturalLanguageCollectionSearch(
    query,
    href,
  );
  const { selectedCollectionsDispatch, collections } = useStacMap();
  const fitBbox = useFitBbox();

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error during natural language collection search",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (results) {
      selectedCollectionsDispatch({ type: "deselect-all-collections" });
      const collectionIds = new Set();
      results.forEach((result) => {
        selectedCollectionsDispatch({
          type: "select-collection",
          id: result.collection_id,
        });
        collectionIds.add(result.collection_id);
      });
      if (collections) {
        const selectedCollections = collections.filter((collection) =>
          collectionIds.has(collection.id),
        );
        if (selectedCollections.length > 0) {
          fitBbox(getCollectionsExtent(selectedCollections));
        }
      }
    }
  }, [results, collections, selectedCollectionsDispatch, fitBbox]);

  if (isPending) {
    return (
      <Center>
        <Spinner size={"sm"}></Spinner>
      </Center>
    );
  } else if (results) {
    return (
      <Stack>
        <Heading size={"md"}>
          Found {results.length} result{results.length > 1 && "s"}
        </Heading>
        <DataList.Root size={"sm"}>
          {results.map((result) => (
            <DataList.Item key={result.collection_id}>
              <DataList.ItemLabel>{result.collection_id}</DataList.ItemLabel>
              <DataList.ItemValue>{result.explanation}</DataList.ItemValue>
            </DataList.Item>
          ))}
        </DataList.Root>
      </Stack>
    );
  }
}
