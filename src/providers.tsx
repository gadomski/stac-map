import { Layer } from "@deck.gl/core";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useReducer,
} from "react";
import {
  LayersDispatchContext,
  layersReducer,
  SelectedContext,
  SelectedDispatchContext,
  selectedReducer,
} from "./context";

export function SelectedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectedReducer, {
    collectionIds: new Set<string>(),
    item: null,
    stacGeoparquetId: null,
  });

  return (
    <SelectedContext value={state}>
      <SelectedDispatchContext value={dispatch}>
        {children}
      </SelectedDispatchContext>
    </SelectedContext>
  );
}

export function LayersProvider({
  setLayers,
  children,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>> | undefined;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(layersReducer, {
    value: null,
    selected: null,
  });

  useEffect(() => {
    if (setLayers) {
      const layers = [];
      if (state.selected) {
        layers.push(state.selected.clone({ id: "selected" }));
      }
      if (state.value) {
        layers.push(state.value.clone({ id: "value" }));
      }
      setLayers(layers);
    }
  }, [setLayers, state]);

  return (
    <LayersDispatchContext value={dispatch}>{children}</LayersDispatchContext>
  );
}
