import { HStack, Text } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
export default function Footer() {
  const { loading, error } = useDuckDb();

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
    </HStack>
  );
}
