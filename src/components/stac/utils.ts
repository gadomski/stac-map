import type { StacValue } from "./types";

export function getSelfHref(value: StacValue) {
  return value.links?.find((link) => link.rel == "self")?.href;
}
