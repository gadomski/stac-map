import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type UseStacGeoparquetReturn = {
  duckDbLoading: boolean;
  duckDbError?: Error;
  path?: string;
  metadata?: StacGeoparquetMetadata;
  fileUpload?: File;
  setFileUpload: Dispatch<SetStateAction<File | undefined>>;
};

type StacGeoparquetMetadata = {
  count: number;
};

export function useStacGeoparquet(): UseStacGeoparquetReturn {
  const { db, loading, error } = useDuckDb();
  const [fileUpload, setFileUpload] = useState<File | undefined>();
  const [path, setPath] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<
    StacGeoparquetMetadata | undefined
  >();

  useEffect(() => {
    if (fileUpload && db) {
      (async () => {
        const buffer = await fileUpload.arrayBuffer();
        db.registerFileBuffer(fileUpload.name, new Uint8Array(buffer));
        setPath(fileUpload.name);
      })();
    }
  }, [db, fileUpload]);

  useEffect(() => {
    if (path && db) {
      (async () => {
        const connection = await db.connect();
        const result = await connection.query(
          `SELECT COUNT(*) as count FROM read_parquet(${path}, union_by_name=true)`
        );
        const rows = result.toArray().map((row) => row.toJSON());
        setMetadata({
          count: rows[0].count,
        });
      })();
    }
  }, [db, path]);

  return {
    duckDbLoading: loading,
    duckDbError: error,
    path,
    metadata,
    fileUpload,
    setFileUpload,
  };
}
