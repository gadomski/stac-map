import { type ReactNode, useReducer } from "react";
import { LayersContext, reduceMapAction } from "./context";

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceMapAction, { layers: [] });
  return <LayersContext value={{ state, dispatch }}>{children}</LayersContext>;
}
