import { useContext } from "react";
import { StacGeoparquetContext } from "./context";

export function useStacGeoparquet() {
  const context = useContext(StacGeoparquetContext);
  if (context) {
    return context.state;
  } else {
    throw new Error(
      "useStacGeoparquet must be used from within a StacGeoparquetProvider"
    );
  }
}

export function useStacGeoparquetDispatch() {
  const context = useContext(StacGeoparquetContext);
  if (context) {
    return context.dispatch;
  } else {
    throw new Error(
      "useStacGeoparquetDispatch must be used from within a StacGeoparquetProvider"
    );
  }
}
