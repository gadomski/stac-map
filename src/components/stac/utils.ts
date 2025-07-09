import type { StacCollection } from "stac-ts";
import type { StacItemCollection } from "./types";
import type { StacItem } from "stac-ts";

export function sanitizeBbox(bbox: number[]) {
  const newBbox = (bbox.length == 6 && [
    bbox[0],
    bbox[1],
    bbox[3],
    bbox[4],
  ]) || [bbox[0], bbox[1], bbox[2], bbox[3]];
  if (newBbox[0] < -180) {
    newBbox[0] = -180;
  }
  if (newBbox[1] < -90) {
    newBbox[1] = -90;
  }
  if (newBbox[2] > 180) {
    newBbox[2] = 180;
  }
  if (newBbox[3] > 90) {
    newBbox[3] = 90;
  }
  return newBbox as [number, number, number, number];
}

export function getCollectionsExtent(collections: StacCollection[]) {
  const validCollections = collections.filter(
    (collection) => collection.extent?.spatial?.bbox?.[0],
  );

  if (validCollections.length == 0) {
    return [-180, -90, 180, 90];
  }

  const bbox = [180, 90, -180, -90];
  validCollections.forEach((collection) => {
    const sanitizedBbox = sanitizeBbox(collection.extent.spatial.bbox[0]);
    if (sanitizedBbox[0] < bbox[0]) {
      bbox[0] = sanitizedBbox[0];
    }
    if (sanitizedBbox[1] < bbox[1]) {
      bbox[1] = sanitizedBbox[1];
    }
    if (sanitizedBbox[2] > bbox[2]) {
      bbox[2] = sanitizedBbox[2];
    }
    if (sanitizedBbox[3] > bbox[3]) {
      bbox[3] = sanitizedBbox[3];
    }
  });
  return bbox;
}

export function getItemCollectionExtent(itemCollection: StacItemCollection) {
  const bbox = [180, 90, -180, -90];
  let seen = false;
  itemCollection.features.forEach((item) => {
    if (item.bbox) {
      seen = true;
      const sanitizedBbox = sanitizeBbox(item.bbox);
      if (sanitizedBbox[0] < bbox[0]) {
        bbox[0] = sanitizedBbox[0];
      }
      if (sanitizedBbox[1] < bbox[1]) {
        bbox[1] = sanitizedBbox[1];
      }
      if (sanitizedBbox[2] > bbox[2]) {
        bbox[2] = sanitizedBbox[2];
      }
      if (sanitizedBbox[3] > bbox[3]) {
        bbox[3] = sanitizedBbox[3];
      }
    }
  });
  if (seen) {
    return bbox;
  } else {
    return [-180, -90, 180, 90];
  }
}

export function isCollectionWithinDateRange(
  collection: StacCollection,
  dateRange: { startDate: string | null; endDate: string | null } | null,
) {
  if (!collection.extent?.temporal?.interval?.[0]) {
    return false;
  }

  if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
    return true;
  }

  const temporalExtents = collection.extent.temporal.interval[0];
  const collectionStart = temporalExtents[0] ? new Date(temporalExtents[0]) : null;
  const collectionEnd = temporalExtents[1] ? new Date(temporalExtents[1]) : null;
  
  const filterStart = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const filterEnd = dateRange.endDate ? new Date(dateRange.endDate) : null;

  if (!collectionStart && !collectionEnd) {
    return false;
  }

  if (filterStart && collectionEnd && collectionEnd < filterStart) {
    return false;
  }

  if (filterEnd && collectionStart && collectionStart > filterEnd) {
    return false;
  }

  return true;
}

export function isItemWithinDateRange(
  item: StacItem,
  dateRange: { startDate: string | null; endDate: string | null } | null,
) {
  const itemDate = item.properties?.datetime;
  if (!itemDate) {
    return false;
  }

  if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
    return true;
  }

  const itemDateTime = new Date(itemDate);
  const filterStart = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const filterEnd = dateRange.endDate ? new Date(dateRange.endDate) : null;

  if (filterStart && itemDateTime < filterStart) {
    return false;
  }

  if (filterEnd && itemDateTime > filterEnd) {
    return false;
  }

  return true;
}

export function formatDateRangeForStacSearch(
  dateRange: { startDate: string | null; endDate: string | null } | null
): string | null {
  if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
    return null;
  }

  // Convert date strings to RFC3339 format
  const formatDateToRFC3339 = (dateString: string, isEndDate: boolean = false): string => {
    if (isEndDate) {
      return `${dateString}T23:59:59Z`;
    } else {
      return `${dateString}T00:00:00Z`;
    }
  };

  if (dateRange.startDate && dateRange.endDate) {
    const startDate = formatDateToRFC3339(dateRange.startDate, false);
    const endDate = formatDateToRFC3339(dateRange.endDate, true);
    return `${startDate}/${endDate}`;
  } else if (dateRange.startDate) {
    const startDate = formatDateToRFC3339(dateRange.startDate, false);
    return `${startDate}/..`;
  } else if (dateRange.endDate) {
    const endDate = formatDateToRFC3339(dateRange.endDate, true);
    return `../${endDate}`;
  }

  return null;
}
