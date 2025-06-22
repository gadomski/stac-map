import { useEffect, useReducer, type ReactNode } from "react";
import { StacContext, type StacAction, type StacState } from "./context";
import { useStacGeoparquet, useStacJson } from "./hooks";

export default function StacProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {});
  const { itemCollection, table } = useStacGeoparquet(
    (state.path?.endsWith(".parquet") && state.path) || undefined
  );
  const { container, searchEndpoint } = useStacJson(
    (!state.path?.endsWith(".parquet") && state.path) || undefined
  );

  useEffect(() => {
    if (itemCollection) {
      dispatch({ type: "set-container", container: itemCollection });
    }
  }, [itemCollection]);

  useEffect(() => {
    if (container) {
      dispatch({ type: "set-container", container });
    }
  }, [container]);

  useEffect(() => {
    if (searchEndpoint) {
      dispatch({ type: "set-search-endpoint", searchEndpoint });
    }
  }, [searchEndpoint]);

  useEffect(() => {
    if (table) {
      dispatch({ type: "set-table", table });
    }
  }, [table]);

  return <StacContext value={{ state, dispatch }}>{children}</StacContext>;
}

function reducer(state: StacState, action: StacAction) {
  switch (action.type) {
    case "set-path":
      return {
        ...state,
        path: action.path,
      };
    case "set-container":
      return {
        ...state,
        container: action.container,
        table: undefined,
        searchEndpoint: undefined,
      };
    case "set-search-endpoint":
      return {
        ...state,
        searchEndpoint: action.searchEndpoint,
      };
    case "set-table":
      return {
        ...state,
        table: action.table,
      };
    case "set-id":
      return {
        ...state,
        id: action.id,
      };
    case "set-bounds":
      return {
        ...state,
        bounds: action.bounds,
      };
  }
}
