import { Alert, SimpleGrid, Stack } from "@chakra-ui/react";
import { useDuckDb } from "duckdb-wasm-kit";
import { useStacGeoparquet } from "./stac-geoparquet/hooks";

export default function Sidebar() {
  const { loading, error } = useDuckDb();
  const { metadata } = useStacGeoparquet();

  return (
    <SimpleGrid columns={4} my={2}>
      <Stack bg={"bg.muted"} px={4} py={2} fontSize={"sm"} rounded={"sm"}>
        {(metadata && `${metadata.count} items`) || "No file loaded..."}
      </Stack>
      <Stack fontSize={"small"} mx={4} my={2}>
        {loading && (
          <Alert.Root status={"info"}>
            <Alert.Indicator></Alert.Indicator>
            <Alert.Content>Loading DuckDB...</Alert.Content>
          </Alert.Root>
        )}
        {error && (
          <Alert.Root status={"error"}>
            <Alert.Indicator></Alert.Indicator>
            <Alert.Content>DuckDB error: {error.toString()}</Alert.Content>
          </Alert.Root>
        )}
      </Stack>
    </SimpleGrid>
  );
}
