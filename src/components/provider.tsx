import { LngLatBounds } from "maplibre-gl";
import { useReducer, type ReactNode } from "react";
import {
  AppStateContext,
  AppStateDispatchContext,
  type AppState,
  type AppStateAction,
} from "./context";
import { valuesMatch } from "./stac/utils";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, {
    picked: null,
    fitBounds: null,
    selected: [],
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
    case "pick":
      return { ...state, picked: action.value || null };
    case "fit-bbox":
      return {
        ...state,
        fitBounds: new LngLatBounds(action.bbox),
      };
    case "select":
      return {
        ...state,
        selected: [...state.selected, action.value],
      };
    case "deselect":
      return {
        ...state,
        selected: state.selected.filter(
          (value) => !valuesMatch(value, action.value),
        ),
      };
    default:
      return state;
  }
}
