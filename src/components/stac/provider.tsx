import { type ReactNode, useEffect, useReducer } from "react";
import { toaster } from "../ui/toaster";
import { StacContext } from "./context";
import type { StacAction, StacState } from "./types";

export function StacProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    (async () => {
      if (state.href) {
        if (state.href?.endsWith(".parquet")) {
          dispatch({
            type: "set-value",
            value: {
              type: "FeatureCollection",
              id: state.href.split("/").pop(),
              description: "A stac-geoparquet file",
              features: [],
            },
          });
        } else {
          const value = await getStacJson(state.href);
          dispatch({ type: "set-value", value });
        }
      }
    })();
  }, [state.href]);

  return <StacContext value={{ state, dispatch }}>{children}</StacContext>;
}

function reducer(state: StacState, action: StacAction) {
  switch (action.type) {
    case "set-href":
      return { ...state, href: action.href, value: undefined };
    case "set-value":
      return { ...state, value: action.value };
  }
}

async function getStacJson(href: string) {
  try {
    const response = await fetch(href, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (
        ["Feature", "Catalog", "Collection", "FeatureCollection"].includes(
          data.type
        )
      ) {
        return data;
      } else {
        toaster.create({
          type: "error",
          title: "Invalid STAC",
          description:
            "GET " + href + " has an invalid type field: " + data.type,
        });
      }
    }
  } catch (error) {
    toaster.create({
      type: "error",
      title: "Error getting STAC",
      // @ts-expect-error Don't want to type the error
      description: "GET " + href + ": " + error.toString(),
    });
  }
}
