import { HStack, Text } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";
export default function Footer() {
  const { loading, error } = useDuckDb();
  const state = useStacGeoparquet();

  return (
    <HStack
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
      }}
      px={4}
      py={2}
    >
      {loading && <Text>Loading DuckDB...</Text>}
      {error && <Text color={"red"}>DuckDB error: {error.toString()}</Text>}
      {state.path && !state.metadata && <Text>Loading {state.path}</Text>}
      {state.metadata && !state.table && <Text>Filtering {state.path}</Text>}
    </HStack>
  );
}
