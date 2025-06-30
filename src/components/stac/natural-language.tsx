import {
  Center,
  CloseButton,
  Collapsible,
  DataList,
  Field,
  Heading,
  HStack,
  Input,
  InputGroup,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import type { StacCollection } from "stac-ts";
import { useAppStateDispatch } from "../hooks";
import { toaster } from "../ui/toaster";
import { Collections } from "./collection";
import { useNaturalLanguageCollectionSearch } from "./hooks";
import { sanitizeBbox } from "./utils";

export function NaturalLanguageCollectionSearch({
  href,
  collections,
}: {
  href: string;
  collections: StacCollection[];
}) {
  const [query, setQuery] = useState<string | undefined>();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppStateDispatch();

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setValue("");
        setQuery(undefined);
        dispatch({ type: "deselect-all" });
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
          <Field.Label>Natural language collection search</Field.Label>
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
      {query && (
        <Results query={query} href={href} collections={collections}></Results>
      )}
    </Stack>
  );
}

function Results({
  query,
  href,
  collections,
}: {
  query: string;
  href: string;
  collections: StacCollection[];
}) {
  const { results, loading, error } = useNaturalLanguageCollectionSearch(
    query,
    href,
  );
  const dispatch = useAppStateDispatch();
  const [searchedCollections, setSearchedCollections] = useState<
    StacCollection[] | undefined
  >();

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
      const collectionIds = results?.map((result) => result.collection_id);
      const searchedCollections: StacCollection[] = [];
      collections.forEach((collection) => {
        if (collectionIds.includes(collection.id)) {
          dispatch({ type: "select", value: collection });
          searchedCollections.push(collection);
        } else {
          dispatch({ type: "deselect", value: collection });
        }
      });
      setSearchedCollections(searchedCollections);
      if (searchedCollections.length == 1) {
        dispatch({
          type: "fit-bbox",
          bbox: sanitizeBbox(searchedCollections[0].extent.spatial.bbox[0]),
        });
      }
    }
  }, [results, collections, dispatch]);

  if (loading) {
    return (
      <Center>
        <Spinner size={"sm"}></Spinner>
      </Center>
    );
  } else if (results) {
    return (
      <Stack>
        <Heading size={"md"}>Search results</Heading>
        <Collapsible.Root>
          <Collapsible.Trigger>
            <HStack>
              <Text fontSize={"sm"} fontWeight={"light"}>
                {results.length} collection{results.length > 1 && "s"} found...
              </Text>
            </HStack>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <DataList.Root size={"sm"} mt={4}>
              {results.map((result) => (
                <DataList.Item key={result.collection_id}>
                  <DataList.ItemLabel>
                    {result.collection_id}
                  </DataList.ItemLabel>
                  <DataList.ItemValue>{result.explanation}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>
          </Collapsible.Content>
        </Collapsible.Root>

        {searchedCollections && (
          <Collections collections={searchedCollections}></Collections>
        )}
      </Stack>
    );
  }
}
