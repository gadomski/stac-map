import { createContext } from "react";
import type { StacContextType } from "./types";

export const StacContext = createContext<StacContextType | null>(null);
