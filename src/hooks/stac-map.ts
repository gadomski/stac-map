import { useContext } from "react";
import { StacMapContext } from "../context/stac-map";

export default function useStacMap() {
  const context = useContext(StacMapContext);
  if (context) {
    return context;
  } else {
    throw new Error("useStacMap must be used from within a StacMapProvider");
  }
}
