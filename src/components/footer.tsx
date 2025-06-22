import { Stack, Text } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useStac } from "./stac/hooks";
export default function Footer() {
  const { loading, error } = useDuckDb();
  const { href, value } = useStac();

  return (
    <Stack
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
      }}
      px={4}
      py={2}
      fontWeight={"lighter"}
    >
      {loading && <Text>Loading DuckDB...</Text>}
      {error && <Text color={"red"}>DuckDB error: {error.toString()}</Text>}
      {href && !value && <Text>Loading {href}...</Text>}
    </Stack>
  );
}
