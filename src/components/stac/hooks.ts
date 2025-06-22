import { useContext } from "react";
import { StacContext } from "./context";

export function useStac() {
  const context = useContext(StacContext);
  if (context) {
    return context.state;
  } else {
    throw new Error("useStac must be used from within a StacProvider");
  }
}

export function useStacDispatch() {
  const context = useContext(StacContext);
  if (context) {
    return context.dispatch;
  } else {
    throw new Error("useStacDispatch must be used from within a StacProvider");
  }
}
