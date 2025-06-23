import {
  Badge,
  Table as ChakraTable,
  DataList,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { GeoArrowPolygonLayer } from "@geoarrow/deck.gl-layers";
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
import { useLayersDispatch } from "../map/context";

type Summary = {
  count: number;
  bbox: number[];
};

export default function StacGeoparquet({ path }: { path: string }) {
  const { table, loading, error } = useQuery(
    path,
    "ST_AsWKB(geometry) as geometry, id"
  );
  const { table: summaryTable } = useQuery(
    path,
    "COUNT(*) as count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax"
  );
  const { table: kvMetadataTable } = useQuery(
    path,
    "key, value",
    "parquet_kv_metadata"
  );
  const [summary, setSummary] = useState<Summary | undefined>();
  const [keyValueMetadata, setKeyValueMetadata] = useState<
    { key: string; value: any }[] | undefined // eslint-disable-line
  >();
  const dispatch = useLayersDispatch();

  useEffect(() => {
    if (table) {
      const geometry: Uint8Array[] = table.getChildAt(0)?.toArray();
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
      const newTable = new Table({
        // @ts-expect-error: 2769
        geometry: makeVector(polygons),
        id: vectorFromArray(table.getChild("id")?.toArray()),
      });
      newTable.schema.fields[0].metadata.set(
        "ARROW:extension:name",
        "geoarrow.polygon"
      );
      const layer = new GeoArrowPolygonLayer({
        id: "geoarrow-polygons",
        data: newTable,
        stroked: true,
        filled: true,
        getFillColor: [207, 63, 2, 25],
        getLineColor: [207, 63, 2, 50],
        lineWidthUnits: "pixels",
        pickable: true,
        autoHighlight: true,
      });
      dispatch({ type: "set-layers", layers: [layer] });
    } else {
      dispatch({ type: "set-layers", layers: [] });
    }
  }, [table, dispatch]);

  useEffect(() => {
    if (summaryTable) {
      const row = summaryTable.toArray().map((row) => row.toJSON())[0];
      const summary: Summary = {
        count: row.count,
        bbox: [row.xmin, row.ymin, row.xmax, row.ymax],
      };
      setSummary(summary);
      dispatch({
        type: "set-bbox",
        bbox: summary.bbox,
      });
    }
  }, [summaryTable, dispatch]);

  useEffect(() => {
    if (summaryTable) {
      const row = summaryTable.toArray().map((row) => row.toJSON())[0];
      const summary: Summary = {
        count: row.count,
        bbox: [row.xmin, row.ymin, row.xmax, row.ymax],
      };
      setSummary(summary);
    }
  }, [summaryTable, dispatch]);

  useEffect(() => {
    if (kvMetadataTable) {
      const decoder = new TextDecoder("utf-8");
      const metadata = kvMetadataTable
        .toArray()
        .map((row) => {
          const jsonRow = row.toJSON();
          const key = decoder.decode(jsonRow.key);
          const value = decoder.decode(jsonRow.value);
          try {
            return { key, value: JSON.parse(value) };
          } catch {
            return undefined;
          }
        })
        .filter((row) => row !== undefined);
      setKeyValueMetadata(metadata);
    }
  }, [kvMetadataTable, setKeyValueMetadata]);

  if (error) {
    return <Text color={"red"}>Error: {error}</Text>;
  } else if (loading || summary === undefined) {
    return <Skeleton h={200}></Skeleton>;
  } else {
    return (
      <DataList.Root orientation={"horizontal"}>
        <DataList.Item>
          <DataList.ItemLabel>Number of items</DataList.ItemLabel>
          <DataList.ItemValue>{summary.count}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Bounding box</DataList.ItemLabel>
          <DataList.ItemValue>
            {summary.bbox.map((n) => Number(n.toFixed(4))).join(", ")}
          </DataList.ItemValue>
        </DataList.Item>
        {keyValueMetadata?.map((row) => (
          <MetataDataListItem row={row} key={row.key}></MetataDataListItem>
        ))}
      </DataList.Root>
    );
  }
}

function MetataDataListItem({
  row,
}: {
  // eslint-disable-next-line
  row: { key: string; value: { [k: string]: any } };
}) {
  return (
    <DataList.Item>
      <DataList.ItemLabel>
        {row.key} <Badge>metadata</Badge>
      </DataList.ItemLabel>
      <DataList.ItemValue>
        <ChakraTable.ScrollArea>
          <ChakraTable.Root size={"sm"}>
            <ChakraTable.Body>
              {Object.entries(row.value).map(([k, v]) => (
                <ChakraTable.Row key={k}>
                  <ChakraTable.Cell>{k}</ChakraTable.Cell>
                  <ChakraTable.Cell>
                    {(typeof v === "string" && v) || JSON.stringify(v)}
                  </ChakraTable.Cell>
                </ChakraTable.Row>
              ))}
            </ChakraTable.Body>
          </ChakraTable.Root>
        </ChakraTable.ScrollArea>
      </DataList.ItemValue>
    </DataList.Item>
  );
}

function useQuery(path: string, select: string, customFunction?: string) {
  const { db, loading: duckDbLoading, error: duckDbError } = useDuckDb();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [table, setTable] = useState<Table | undefined>();

  // TODO what do we do about union by name issues with globs?
  const from =
    (customFunction && `${customFunction}('${path}')`) ||
    `read_parquet('${path}', union_by_name=true)`;

  useEffect(() => {
    if (db) {
      (async () => {
        setLoading(true);
        try {
          const connection = await db.connect();
          connection.query("LOAD spatial;");
          const table = await connection.query(`SELECT ${select} FROM ${from}`);
          // @ts-expect-error Don't know why the tables aren't recognized
          setTable(table);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setError(e.toString());
        }

        setLoading(false);
      })();
    }
  }, [db, setError, setLoading, setTable, select, from]);

  useEffect(() => {
    if (duckDbLoading) {
      setLoading(duckDbLoading);
    }
  }, [duckDbLoading, setLoading]);

  useEffect(() => {
    if (duckDbError) {
      setError(`DuckDB Error: ${duckDbError.toString()}`);
    }
  }, [duckDbError, setError]);

  return { table, loading, error };
}
