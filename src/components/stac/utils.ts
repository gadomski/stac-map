import type { StacValue } from "./types";

export function getSelfHref(value: StacValue) {
  return value.links?.find((link) => link.rel == "self")?.href;
}

export function sanitizeBbox(bbox: number[]) {
  if (bbox[0] < -180) {
    bbox[0] = -180;
  }
  if (bbox[1] < -90) {
    bbox[1] = -90;
  }
  const [i0, i1] = bbox.length == 6 ? [3, 4] : [2, 3];
  if (bbox[i0] > 180) {
    bbox[i0] = 180;
  }
  if (bbox[i1] > 90) {
    bbox[i1] = 90;
  }
  return bbox;
}

export function isUrl(href: string) {
  try {
    new URL(href);
  } catch {
    return false;
  }
  return true;
}
