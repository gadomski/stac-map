import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { io } from "@geoarrow/geoarrow-js";
import {
  Binary,
  Data,
  makeData,
  makeVector,
  Table,
  vectorFromArray,
} from "apache-arrow";
import { useDuckDb } from "duckdb-wasm-kit";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useReducer, useState, type ReactNode } from "react";
import * as stacWasm from "../../stac-wasm";
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
        await connection.query("load spatial");
        setConnection(connection);
      })();
    }
  }, [db]);

  useEffect(() => {
    if (state.path) {
      if (connection) {
        (async () => {
          let result;
          try {
            result = await connection.query(
              `SELECT COUNT(*) AS count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax FROM read_parquet('${state.path}', union_by_name=true);`
            );
          } catch (e) {
            toaster.create({
              type: "error",
              title: "Error loading file",
              // @ts-expect-error: Don't want to bother with error typing
              description: e.toString(),
            });
            return;
          }
          const row = result.toArray().map((row) => row.toJSON())[0];
          const count = row.count;
          const bounds = new LngLatBounds([
            row.xmin,
            row.ymin,
            row.xmax,
            row.ymax,
          ]);
          dispatch({
            type: "set-metadata",
            metadata: { count, bounds },
          });
          toaster.create({
            type: "success",
            title: "Loaded",
            description: count + " items from " + state.path,
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

  // We separate this section to handle query updates
  useEffect(() => {
    if (state.path) {
      if (connection) {
        (async () => {
          const result = await connection.query(
            `SELECT st_aswkb(geometry) as geometry, id FROM read_parquet('${state.path}', union_by_name=true);`
          );
          const geometry: Uint8Array[] = result.getChildAt(0)?.toArray();
          const wkb = new Uint8Array(geometry?.flatMap((array) => [...array]));
          const valueOffsets = new Int32Array(geometry.length + 1);
          for (let i = 0, len = geometry.length; i < len; i++) {
            const current = valueOffsets[i];
            valueOffsets[i + 1] = current + geometry[i].length;
          }
          const data: Data<Binary> = makeData({
            type: new Binary(),
            data: wkb,
            valueOffsets,
          });
          const polygons = io.parseWkb(data, io.WKBType.Polygon, 2);
          const table = new Table({
            // @ts-expect-error: 2769
            geometry: makeVector(polygons),
            id: vectorFromArray(result.getChild("id")?.toArray()),
          });
          table.schema.fields[0].metadata.set(
            "ARROW:extension:name",
            "geoarrow.polygon"
          );
          dispatch({
            type: "set-table",
            table,
          });
        })();
      }
    }
  }, [state.path, connection, dispatch]);

  useEffect(() => {
    if (state.id && state.path) {
      if (connection) {
        (async () => {
          // TODO refactor query so we don't repeat logic.
          const result = await connection.query(
            `SELECT * EXCLUDE geometry FROM read_parquet('${state.path}', union_by_name=true) where id = '${state.id}'`
          );
          const item = stacWasm.arrowToStacJson(result)[0];
          dispatch({ type: "set-item", item });
        })();
      } else {
        // TODO Handle missing connection
      }
    }
  }, [state.id, state.path, connection, dispatch]);

  return (
    <StacGeoparquetContext value={{ state, dispatch }}>
      {children}
    </StacGeoparquetContext>
  );
}

function reducer(state: StacGeoparquetState, action: StacGeoparquetAction) {
  switch (action.type) {
    case "set-path":
      return { ...state, path: action.path, id: undefined, item: undefined };
    case "set-metadata":
      return { ...state, metadata: action.metadata };
    case "set-table":
      return { ...state, table: action.table };
    case "set-id":
      return { ...state, id: action.id, item: undefined };
    case "set-item":
      return { ...state, item: action.item };
  }
}
