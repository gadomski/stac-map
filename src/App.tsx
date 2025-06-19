import { Box } from "@chakra-ui/react";
import { type DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { useEffect } from "react";
import "./App.css";
import Map from "./components/map";
import Overlay from "./components/overlay";

function App() {
  useEffect(() => {
    const config: DuckDBConfig = {
      query: {
        castBigIntToDouble: true,
      },
    };
    initializeDuckDb({ config });
  }, []);

  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Map></Map>
      </Box>
      <Overlay></Overlay>
    </>
  );
}

export default App;
