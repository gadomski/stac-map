import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { useDuckDb } from "duckdb-wasm-kit";
import { useContext, useEffect, useState } from "react";
import { StacContext } from "./context";

export function useStac() {
  const context = useContext(StacContext);
  if (context) {
    return context.state;
  } else {
    throw new Error("useStac must be used from within a StacProvider");
  }
}

export function useStacDispatch() {
  const context = useContext(StacContext);
  if (context) {
    return context.dispatch;
  } else {
    throw new Error("useStacDispatch must be used from within a StacProvider");
  }
}

export function useDuckDbConnection() {
  const { db } = useDuckDb();
  const [connection, setConnection] = useState<
    AsyncDuckDBConnection | undefined
  >();

  useEffect(() => {
    (async () => {
      if (db) {
        const connection = await db.connect();
        connection.query("LOAD spatial;");
        setConnection(connection);
      } else {
        setConnection(undefined);
      }
    })();
  });

  return connection;
}
