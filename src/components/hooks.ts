import { useContext, useEffect, useState } from "react";
import { AppStateContext, AppStateDispatchContext } from "./context";
import type { StacValue } from "./stac/types";

export function useAppState() {
  const state = useContext(AppStateContext);
  if (state) {
    return state;
  } else {
    throw new Error("useAppState must be used from within an AppStateProvider");
  }
}

export function useAppStateDispatch() {
  const dispatch = useContext(AppStateDispatchContext);
  if (dispatch) {
    return dispatch;
  } else {
    throw new Error(
      "useAppStateDispatch must be used from within a AppStateProvider",
    );
  }
}

export function useIsPicked(value: StacValue) {
  const { picked } = useAppState();
  const [isPicked, setIsPicked] = useState(false);

  useEffect(() => {
    if (picked) {
      setIsPicked(value.type === picked.type && value.id === picked.id);
    } else {
      setIsPicked(false);
    }
  }, [picked, setIsPicked, value.id, value.type]);

  return isPicked;
}
