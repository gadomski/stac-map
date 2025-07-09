import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { io } from "@geoarrow/geoarrow-js";
import { useQuery } from "@tanstack/react-query";
import {
  Binary,
  Data,
  makeData,
  makeVector,
  Table,
  vectorFromArray,
} from "apache-arrow";
import { useEffect } from "react";
import * as stacWasm from "../../stac-wasm";
import { toaster } from "../ui/toaster";

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

export function useStacGeoparquetTable(
  path: string | undefined,
  connection: AsyncDuckDBConnection | undefined,
  dateRange?: { startDate: string | null; endDate: string | null } | null,
) {
  const { data, isPending, error } = useQuery({
    queryKey: ["stac-geoparquet-table", path, dateRange],
    queryFn: async () => {
      if (connection && path) {
        return getGeometryTable(path, connection, dateRange);
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while getting the stac-geoparquet table",
        description: error.message,
      });
    }
  }, [error]);

  return { table: data ?? undefined, isPending };
}

export function useStacGeoparquetMetadata(
  path: string | undefined,
  connection: AsyncDuckDBConnection | undefined,
  dateRange?: { startDate: string | null; endDate: string | null } | null,
) {
  const { data, isPending, error } = useQuery({
    queryKey: ["stac-geoparquet-metadata", path, dateRange],
    queryFn: async () => {
      if (connection && path) {
        return await getMetadata(path, connection, dateRange);
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while getting the stac-geoparquet table",
        description: error.message,
      });
    }
  }, [error]);

  return { metadata: data ?? undefined, isPending };
}

async function getGeometryTable(
  path: string,
  connection: AsyncDuckDBConnection,
  dateRange?: { startDate: string | null; endDate: string | null } | null,
) {
  let whereClause = "";
  if (dateRange && (dateRange.startDate || dateRange.endDate)) {
    const conditions = [];
    if (dateRange.startDate) {
      conditions.push(`datetime >= '${dateRange.startDate}'`);
    }
    if (dateRange.endDate) {
      conditions.push(`datetime <= '${dateRange.endDate}'`);
    }
    whereClause = `WHERE ${conditions.join(" AND ")}`;
  }

  const result = await connection.query(
    `SELECT ST_AsWKB(geometry) as geometry, id FROM read_parquet('${path}') ${whereClause}`,
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
  dateRange?: { startDate: string | null; endDate: string | null } | null,
): Promise<StacGeoparquetMetadata> {
  let whereClause = "";
  if (dateRange && (dateRange.startDate || dateRange.endDate)) {
    const conditions = [];
    if (dateRange.startDate) {
      conditions.push(`datetime >= '${dateRange.startDate}'`);
    }
    if (dateRange.endDate) {
      conditions.push(`datetime <= '${dateRange.endDate}'`);
    }
    whereClause = `WHERE ${conditions.join(" AND ")}`;
  }

  const summaryResult = await connection.query(
    `SELECT COUNT(*) as count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax FROM read_parquet('${path}') ${whereClause}`,
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

export function useStacGeoparquetItem(
  id: string | undefined,
  path: string | undefined,
  connection: AsyncDuckDBConnection | undefined,
) {
  const { data, isPending, error } = useQuery({
    queryKey: ["stac-geoparquet-item", id, path],
    queryFn: async () => {
      if (id && path && connection) {
        const result = await connection.query(
          `SELECT * REPLACE ST_AsGeoJSON(geometry) as geometry FROM read_parquet('${path}') WHERE id = '${id}'`,
        );
        const item = stacWasm.arrowToStacJson(result)[0];
        item.geometry = JSON.parse(item.geometry);
        return item;
      } else {
        return null;
      }
    },
  });

  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: "Error while getting stac-geoparquet item",
        description: error.message,
      });
    }
  }, [error]);

  return { item: data, isPending };
}
