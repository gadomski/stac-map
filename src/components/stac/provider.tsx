import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
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
import { type ReactNode, useEffect, useReducer } from "react";
import { toaster } from "../ui/toaster";
import { StacContext } from "./context";
import type { StacAction, StacState } from "./types";

export function StacProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {});
  const { db } = useDuckDb();

  useEffect(() => {
    (async () => {
      if (state.href) {
        if (state.href?.endsWith(".parquet")) {
          if (db) {
            const connection = await db.connect();
            connection.query("LOAD spatial;");
            const count = (
              await queryDuckDb(state.href, connection, {
                select: "COUNT(*) as count",
              })
            )
              ?.toArray()[0]
              .toJSON().count;
            dispatch({
              type: "set-value",
              value: {
                type: "FeatureCollection",
                id: state.href.split("/").pop(),
                description: `A stac-geoparquet file with ${count} items`,
                features: [],
              },
            });
            const bbox = await getStacGeoparquetBbox(state.href, connection);
            if (bbox) {
              dispatch({ type: "set-bbox", bbox });
            }
            const table = await getStacGeoparquetTable(state.href, connection);
            if (table) {
              dispatch({
                type: "set-table",
                table,
              });
            }
          }
        } else {
          const value = await getStacJson(state.href);
          dispatch({ type: "set-value", value });
        }
      }
    })();
  }, [state.href, db]);

  return <StacContext value={{ state, dispatch }}>{children}</StacContext>;
}

function reducer(state: StacState, action: StacAction) {
  switch (action.type) {
    case "set-href":
      if (state.href !== action.href) {
        return {
          ...state,
          href: action.href,
          value: undefined,
          table: undefined,
          geojson: undefined,
        };
      } else {
        return state;
      }
    case "set-value": {
      const newState = { ...state, value: action.value };
      if (
        ["Feature", "FeatureCollection"].includes(action.value.type) &&
        action.value.geometry !== null
      ) {
        // @ts-expect-error We know that we want this here
        newState.geojson = action.value;
      }
      if (action.value.bbox !== undefined) {
        // @ts-expect-error Man this is hard
        newState.bbox = action.value.bbox;
      }
      return newState;
    }
    case "set-table":
      return { ...state, table: action.table };
    case "set-bbox":
      return { ...state, bbox: action.bbox };
  }
}

async function getStacJson(href: string) {
  try {
    const response = await fetch(href, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (
        ["Feature", "Catalog", "Collection", "FeatureCollection"].includes(
          data.type
        )
      ) {
        return data;
      } else {
        toaster.create({
          type: "error",
          title: "Invalid STAC",
          description:
            "GET " + href + " has an invalid type field: " + data.type,
        });
      }
    }
  } catch (error) {
    toaster.create({
      type: "error",
      title: "Error getting STAC",
      // @ts-expect-error Don't want to type the error
      description: "GET " + href + ": " + error.toString(),
    });
  }
}

async function getStacGeoparquetTable(
  href: string,
  connection: AsyncDuckDBConnection
) {
  const select = "ST_AsWKB(geometry) AS geometry, id";
  const result = await queryDuckDb(href, connection, { select });
  if (result) {
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
    return table;
  }
}

async function getStacGeoparquetBbox(
  href: string,
  connection: AsyncDuckDBConnection
) {
  const select =
    "MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax";
  const result = await queryDuckDb(href, connection, {
    select,
  });
  const bbox = result?.toArray()[0].toJSON();
  return [bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax];
}

async function queryDuckDb(
  href: string,
  connection: AsyncDuckDBConnection,
  { select }: { select: string }
) {
  const query = `SELECT ${select} from read_parquet('${href}')`;
  console.log(query);
  try {
    return await connection.query(query);
  } catch (error) {
    toaster.create({
      type: "error",
      title: "Error creating stac-geoparquet layer",
      // @ts-expect-error Don't want to type the error
      description: "SELECT FROM " + href + ": " + error.toString(),
    });
  }
}
