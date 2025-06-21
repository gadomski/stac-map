import { useEffect, useReducer, type ReactNode } from "react";
import { StacContext, type StacAction, type StacState } from "./context";
import { useStacFetch, useStacGeoparquet } from "./hooks";

export default function StacProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {});
  const { itemCollection, table } = useStacGeoparquet(
    state.path,
    state.path?.endsWith(".parquet")
  );
  const container = useStacFetch(state.path, !state.path?.endsWith(".parquet"));

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
    if (table) {
      dispatch({ type: "set-table", table });
    }
  }, [table]);

  return <StacContext value={{ state, dispatch }}>{children}</StacContext>;
}

function reducer(state: StacState, action: StacAction) {
  console.log(action);
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
        search: action.container.links?.find((link) => link.rel == "search")
          ?.href,
        table: undefined,
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
  }
}
