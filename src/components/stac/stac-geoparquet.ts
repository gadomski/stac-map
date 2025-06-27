import { io } from "@geoarrow/geoarrow-js";
import {
  Binary,
  Data,
  makeData,
  makeVector,
  Table,
  vectorFromArray,
} from "apache-arrow";
import type { AsyncDuckDB } from "duckdb-wasm-kit";
import * as stacWasm from "../../stac-wasm";

export async function getGeometryTable(path: string, db: AsyncDuckDB) {
  const connection = await db.connect();
  connection.query("LOAD spatial;");
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

export async function getBbox(path: string, db: AsyncDuckDB) {
  const connection = await db.connect();
  const result = await connection.query(
    `SELECT MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax FROM read_parquet('${path}')`,
  );
  const row = result.toArray().map((row) => row.toJSON())[0];
  return [row.xmin, row.ymin, row.xmax, row.ymax] as [
    number,
    number,
    number,
    number,
  ];
}

export async function getItem(id: string, path: string, db: AsyncDuckDB) {
  const connection = await db.connect();
  const result = await connection.query(
    `SELECT * EXCLUDE geometry FROM read_parquet('${path}') WHERE id = '${id}'`,
  );
  return stacWasm.arrowToStacJson(result)[0];
}
