import { useDuckDb } from "duckdb-wasm-kit";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type UseStacGeoparquetReturn = {
  duckDbLoading: boolean;
  duckDbError?: Error;

  path?: string;

  fileUpload?: File;
  setFileUpload: Dispatch<SetStateAction<File | undefined>>;
};

export function useStacGeoparquet(): UseStacGeoparquetReturn {
  const { db, loading, error } = useDuckDb();
  const [fileUpload, setFileUpload] = useState<File | undefined>();
  const [path, setPath] = useState<string | undefined>();

  useEffect(() => {
    if (fileUpload && db) {
      (async () => {
        const buffer = await fileUpload.arrayBuffer();
        db.registerFileBuffer(fileUpload.name, new Uint8Array(buffer));
        setPath(fileUpload.name);
      })();
    }
  }, [db, fileUpload]);

  return {
    duckDbLoading: loading,
    duckDbError: error,
    path,
    fileUpload,
    setFileUpload,
  };
}
