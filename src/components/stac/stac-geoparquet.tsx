import {
  Badge,
  Center,
  Table as ChakraTable,
  DataList,
  HStack,
  Spinner,
  Stack,
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
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import * as stacWasm from "../../stac-wasm";
import { useMapDispatch } from "../map/context";
import { toaster } from "../ui/toaster";
import { useDuckDbQuery } from "./hooks";
import type { StacValue } from "./types";

export default function StacGeoparquet({
  path,
  setPicked,
}: {
  path: string;
  setPicked?: Dispatch<SetStateAction<StacValue | undefined>>;
}) {
  const [id, setId] = useState<string | undefined>();

  return (
    <Stack>
      <Layer path={path} setId={setId}></Layer>
      <SummaryDataList path={path}></SummaryDataList>
      <MetadataTables path={path}></MetadataTables>
      {id && setPicked && (
        <PickedItem id={id} path={path} setPicked={setPicked}></PickedItem>
      )}
    </Stack>
  );
}

function Layer({
  path,
  setId,
}: {
  path: string;
  setId: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { table, loading, error } = useDuckDbQuery({
    path,
    select: "ST_AsWKB(geometry) as geometry, id",
  });
  const dispatch = useMapDispatch();

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
        onClick: (info) => {
          setId(newTable.getChild("id")?.get(info.index) as string | undefined);
        },
        autoHighlight: true,
      });
    }
  }, [table, dispatch, setId]);

  return <Status error={error} loading={loading} what={"layer"}></Status>;
}

type Summary = {
  count: number;
  bbox: number[];
};

function SummaryDataList({ path }: { path: string }) {
  const { table, error } = useDuckDbQuery({
    path,
    select:
      "COUNT(*) as count, MIN(bbox.xmin) as xmin, MIN(bbox.ymin) as ymin, MAX(bbox.xmax) as xmax, MAX(bbox.ymax) as ymax",
  });
  const [summary, setSummary] = useState<Summary | undefined>();
  const dispatch = useMapDispatch();

  useEffect(() => {
    if (table) {
      const row = table.toArray().map((row) => row.toJSON())[0];
      setSummary({
        count: row.count,
        bbox: [row.xmin, row.ymin, row.xmax, row.ymax],
      });
    }
  }, [table, setSummary]);

  useEffect(() => {
    if (summary?.bbox) {
      dispatch({ type: "set-fit-bbox", bbox: summary.bbox });
    }
  }, [summary?.bbox, dispatch]);

  return (
    <Status error={error} what={"summary"}>
      {summary && (
        <DataList.Root>
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
        </DataList.Root>
      )}
    </Status>
  );
}

type Metadata = {
  key: string;
  value: any; // eslint-disable-line
};

function MetadataTables({ path }: { path: string }) {
  const { table, error } = useDuckDbQuery({
    path,
    select: "key, value",
    customFunction: "parquet_kv_metadata",
  });
  const [metadata, setMetadata] = useState<Metadata[]>([]);

  useEffect(() => {
    if (table) {
      const decoder = new TextDecoder("utf-8");
      const metadata = table
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

      setMetadata(metadata);
    }
  }, [table, setMetadata]);

  return (
    <Status error={error} what="metadata">
      <DataList.Root>
        {metadata.map((row) => (
          <DataList.Item>
            <DataList.ItemLabel>
              <HStack>
                {row.key} <Badge>metadata</Badge>
              </HStack>
            </DataList.ItemLabel>
            <DataList.ItemValue>
              <ChakraTable.ScrollArea>
                <ChakraTable.Root size={"sm"}>
                  <ChakraTable.Body>
                    {Object.entries(row.value).map(([k, v]) => (
                      <ChakraTable.Row key={row.key + k}>
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
        ))}
      </DataList.Root>
    </Status>
  );
}

function PickedItem({
  id,
  path,
  setPicked,
}: {
  id: string;
  path: string;
  setPicked: Dispatch<SetStateAction<StacValue | undefined>>;
}) {
  const { table, error } = useDuckDbQuery({
    path,
    // TODO can we include geometry and then render it again?
    select: "* EXCLUDE geometry",
    where: `id = '${id}'`,
  });

  useEffect(() => {
    if (table) {
      const item = stacWasm.arrowToStacJson(table)[0];
      setPicked(item);
    }
  }, [table, setPicked]);
  return <Status error={error} what="picked item"></Status>;
}

function Status({
  error,
  loading,
  what,
  children,
}: {
  error?: string;
  loading?: boolean;
  what: string;
  children?: ReactNode;
}) {
  useEffect(() => {
    if (error) {
      toaster.create({
        type: "error",
        title: `Error querying stac-geoparquet ${what}`,
        description: error,
      });
    }
  }, [error, what]);

  if (loading == true) {
    return (
      <Center>
        <Spinner></Spinner>
      </Center>
    );
  } else {
    return children;
  }
}
