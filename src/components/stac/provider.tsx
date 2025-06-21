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
import { toaster } from "../ui/toaster";
import { StacContext, type StacAction, type StacState } from "./context";

export default function StacProvider({ children }: { children: ReactNode }) {
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
    (async () => {
      if (state.path) {
        if (state.path.endsWith(".parquet")) {
          if (connection) {
            const metadataResult = await connection.query(
              `SELECT COUNT(*) AS count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax, MIN(datetime) as startDatetime, MAX(datetime) as endDatetime FROM read_parquet('${state.path}', union_by_name=true);`
            );
            const row = metadataResult.toArray().map((row) => row.toJSON())[0];
            const count = row.count;
            const bounds = new LngLatBounds([
              row.xmin,
              row.ymin,
              row.xmax,
              row.ymax,
            ]);
            dispatch({
              type: "set-item-collection",
              itemCollection: {
                type: "FeatureCollection",
                count,
                bounds,
                startDatetime: new Date(row.startDatetime),
                endDatetime: new Date(row.endDatetime),
              },
            });

            const result = await connection.query(
              `SELECT ST_AsWKB(geometry) as geometry, id FROM read_parquet('${state.path}')`
            );
            const geometry: Uint8Array[] = result.getChildAt(0)?.toArray();
            const wkb = new Uint8Array(
              geometry?.flatMap((array) => [...array])
            );
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
          } else {
            // TODO handle un-open connection
          }
        } else {
          const response = await fetch(state.path);
          if (response.ok) {
            // TODO handle pagination? Don't?
            const data = await response.json();
            switch (data.type) {
              case "Catalog":
                dispatch({ type: "set-catalog", catalog: data });
                break;
              case "Collection":
                dispatch({ type: "set-collection", collection: data });
                break;
              default:
                toaster.create({
                  type: "error",
                  title: "Unrecognized STAC path",
                  description: `Could not infer the STAC object from 'type' field: ${data.type}`,
                });
                break;
            }
          }
        }
      }
    })();
  }, [state.path, connection]);

  return <StacContext value={{ state, dispatch }}>{children}</StacContext>;
}

function reducer(state: StacState, action: StacAction) {
  switch (action.type) {
    case "set-path":
      return {
        ...state,
        path: action.path,
        container: undefined,
        search: undefined,
        table: undefined,
        id: undefined,
      };
    case "set-catalog":
      return {
        ...state,
        container: action.catalog,
        search: action.catalog.links.find((link) => link.rel == "search")?.href,
      };
    case "set-collection":
      return {
        ...state,
        container: action.collection,
        search: undefined,
      };
    case "set-item-collection":
      return {
        ...state,
        container: action.itemCollection,
        search: undefined,
      };
    case "set-table":
      return {
        ...state,
        table: action.table,
      };
    case "set-id":
      return {
        ...state,
        id: action.id,
      };
  }
}
