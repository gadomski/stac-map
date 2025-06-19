import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useReducer, useState, type ReactNode } from "react";
import { toaster } from "../ui/toaster";
import {
  StacGeoparquetContext,
  type StacGeoparquetAction,
  type StacGeoparquetState,
} from "./context";

export default function StacGeoparquetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {});
  const { db } = useDuckDb();
  const [connection, setConnection] = useState<
    AsyncDuckDBConnection | undefined
  >();

  useEffect(() => {
    if (db) {
      (async () => {
        const connection = await db.connect();
        setConnection(connection);
      })();
    }
  }, [db]);

  useEffect(() => {
    if (state.path) {
      if (connection) {
        (async () => {
          const result = await connection.query(
            `SELECT COUNT(*) AS count FROM read_parquet('${state.path}', union_by_name=true);`
          );
          const rows = result.toArray().map((row) => row.toJSON());
          dispatch({
            type: "set-metadata",
            metadata: { count: rows[0].count },
          });
          toaster.create({
            type: "success",
            title: "Loaded",
            description: rows[0].count + " items from " + state.path,
          });
        })();
      } else {
        toaster.create({
          type: "error",
          title: "No DuckDB connection",
          description: "Could not load " + state.path,
        });
      }
    } else {
      // TODO handle clearing data
    }
  }, [state.path, connection, dispatch]);

  return (
    <StacGeoparquetContext value={{ state, dispatch }}>
      {children}
    </StacGeoparquetContext>
  );
}

function reducer(state: StacGeoparquetState, action: StacGeoparquetAction) {
  switch (action.type) {
    case "set-path":
      return { ...state, path: action.path };
    case "set-metadata":
      return { ...state, metadata: action.metadata };
  }
}
