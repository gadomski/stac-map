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
import { useEffect, useState } from "react";
import * as stacWasm from "../../stac-wasm";

export interface StacGeoparquetMetadata {
  count: number;
  bbox: [number, number, number, number];
  keyValue: KeyValueMetadata[];
}

interface KeyValueMetadata {
  key: string;
  // eslint-disable-next-line
  value: any;
}

export function useDuckDbConnection() {
  const { db, error } = useDuckDb();
  const [connection, setConnection] = useState<
    AsyncDuckDBConnection | undefined
  >();

  useEffect(() => {
    (async () => {
      if (db) {
        const connection = await db.connect();
        await connection.query("LOAD spatial;");
        setConnection(connection);
      } else {
        setConnection(undefined);
      }
    })();
  }, [db]);

  return { connection, duckDbError: error };
}

export function useStacGeoparquet(path: string) {
  const { connection, duckDbError } = useDuckDbConnection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [table, setTable] = useState<Table | undefined>();
  const [metadata, setMetadata] = useState<
    StacGeoparquetMetadata | undefined
  >();

  useEffect(() => {
    if (duckDbError) {
      setError("DuckDb error: " + duckDbError.toString());
    }
  }, [duckDbError]);

  useEffect(() => {
    (async () => {
      if (connection) {
        setLoading(true);
        setTable(undefined);
        try {
          const table = await getGeometryTable(path, connection);
          setTable(table);
          // eslint-disable-next-line
        } catch (error: any) {
          setError(error.toString());
        }
      }
    })();
  }, [connection, path]);

  useEffect(() => {
    (async () => {
      if (connection) {
        setLoading(true);
        setMetadata(undefined);
        try {
          const metadata = await getMetadata(path, connection);
          setMetadata(metadata);
          // eslint-disable-next-line
        } catch (error: any) {
          setError(error.toString());
        }
      }
    })();
  }, [connection, path]);

  useEffect(() => {
    if (table && metadata) {
      setLoading(false);
    }
  }, [table, metadata]);

  return { table, metadata, loading, error };
}

async function getGeometryTable(
  path: string,
  connection: AsyncDuckDBConnection,
) {
  const result = await connection.query(
    `SELECT ST_AsWKB(geometry) as geometry, id FROM read_parquet('${path}')`,
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
    "geoarrow.polygon",
  );
  return table;
}

async function getMetadata(
  path: string,
  connection: AsyncDuckDBConnection,
): Promise<StacGeoparquetMetadata> {
  const summaryResult = await connection.query(
    `SELECT COUNT(*) as count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax FROM read_parquet('${path}')`,
  );
  const summaryRow = summaryResult.toArray().map((row) => row.toJSON())[0];

  const kvMetadataResult = await connection.query(
    `SELECT key, value FROM parquet_kv_metadata('${path}')`,
  );
  const decoder = new TextDecoder("utf-8");
  const kvMetadata = kvMetadataResult.toArray().map((row) => {
    const jsonRow = row.toJSON();
    const key = decoder.decode(jsonRow.key);
    let value;
    try {
      value = JSON.parse(decoder.decode(jsonRow.value));
    } catch {
      // pass
    }
    return {
      key,
      value,
    };
  });

  return {
    count: summaryRow.count,
    bbox: [summaryRow.xmin, summaryRow.ymin, summaryRow.xmax, summaryRow.ymax],
    keyValue: kvMetadata,
  };
}

export async function getStacGeoparquetItem(
  id: string,
  path: string,
  connection: AsyncDuckDBConnection,
) {
  const result = await connection.query(
    `SELECT * EXCLUDE geometry FROM read_parquet('${path}') WHERE id = '${id}'`,
  );
  return stacWasm.arrowToStacJson(result)[0];
}
