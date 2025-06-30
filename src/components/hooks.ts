import { useContext, useEffect, useState } from "react";
import { AppStateContext, AppStateDispatchContext } from "./context";
import type { StacValue } from "./stac/types";
import { valuesMatch } from "./stac/utils";

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
      setIsPicked(valuesMatch(picked, value));
    } else {
      setIsPicked(false);
    }
  }, [picked, setIsPicked, value]);

  return isPicked;
}

export function useIsSelected(value: StacValue) {
  const { selected } = useAppState();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(!!selected.find((selected) => valuesMatch(value, selected)));
  }, [selected, setIsSelected, value]);

  return isSelected;
}
