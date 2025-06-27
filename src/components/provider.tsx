import { LngLatBounds } from "maplibre-gl";
import { useReducer, type ReactNode } from "react";
import {
  AppStateContext,
  AppStateDispatchContext,
  type AppState,
  type AppStateAction,
} from "./context";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, {
    picked: null,
    fitBounds: null,
  });
  return (
    <AppStateContext value={state}>
      <AppStateDispatchContext value={dispatch}>
        {children}
      </AppStateDispatchContext>
    </AppStateContext>
  );
}

function appStateReducer(state: AppState, action: AppStateAction) {
  switch (action.type) {
    case "set-picked":
      return { ...state, picked: action.picked || null };
    case "fit-bbox":
      return {
        ...state,
        fitBounds: new LngLatBounds(action.bbox),
      };
    default:
      return state;
  }
}
