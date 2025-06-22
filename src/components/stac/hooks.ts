import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { io } from "@geoarrow/geoarrow-js";
import {
  Binary,
  Data,
  Table,
  makeData,
  makeVector,
  vectorFromArray,
} from "apache-arrow";
import { useDuckDb } from "duckdb-wasm-kit";
import { LngLatBounds } from "maplibre-gl";
import { useContext, useEffect, useState } from "react";
import {
  type StacContainer,
  StacContext,
  type StacItemCollection,
  type StacSearchEndpoint,
} from "./context";

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

function useDuckDbConnection() {
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

  return connection;
}

export function useStacGeoparquet(path?: string) {
  const [itemCollection, setItemCollection] = useState<
    StacItemCollection | undefined
  >();
  const [table, setTable] = useState<Table | undefined>();
  const connection = useDuckDbConnection();

  useEffect(() => {
    (async () => {
      if (path && connection) {
        const metadataResult = await connection.query(
          `SELECT COUNT(*) AS count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax, MIN(datetime) as startDatetime, MAX(datetime) as endDatetime FROM read_parquet('${path}', union_by_name=true);`
        );
        const row = metadataResult.toArray().map((row) => row.toJSON())[0];
        const count = row.count;
        const bounds = new LngLatBounds([
          row.xmin,
          row.ymin,
          row.xmax,
          row.ymax,
        ]);
        setItemCollection({
          type: "FeatureCollection",
          count,
          bounds,
          startDatetime: new Date(row.startDatetime),
          endDatetime: new Date(row.endDatetime),
        });
      }
    })();
  }, [path, connection]);

  useEffect(() => {
    (async () => {
      if (path && connection) {
        const result = await connection.query(
          `SELECT ST_AsWKB(geometry) as geometry, id FROM read_parquet('${path}')`
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
        setTable(table);
      }
    })();
  }, [path, connection]);

  return { itemCollection, table };
}

export function useStacJson(path?: string) {
  const [container, setContainer] = useState<StacContainer | undefined>();
  const [searchEndpoint, setSearchEndpoint] = useState<
    StacSearchEndpoint | undefined
  >();

  useEffect(() => {
    (async () => {
      if (path) {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          switch (data.type) {
            case "Catalog":
            case "Collection":
              setContainer(data);
              break;
            default:
              setContainer(undefined);
              break;
          }
        }
      }
    })();
  }, [path]);

  useEffect(() => {
    if (container) {
      const searchLink = container.links?.find((link) => link.rel == "search");
      const dataLink = container.links?.find((link) => link.rel == "data");
      if (searchLink && dataLink) {
        (async () => {
          const response = await fetch(dataLink.href);
          if (response.ok) {
            const collections = (await response.json()).collections;
            setSearchEndpoint({
              href: searchLink.href,
              collections: collections,
            });
          }
        })();
      }
    }
  }, [container]);

  return { container, searchEndpoint };
}
