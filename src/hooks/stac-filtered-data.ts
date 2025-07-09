import { useMemo } from "react";
import useStacMap from "./stac-map";
import { isItemWithinDateRange } from "../utils/date-filter";

export function useFilteredSearchItems() {
  const { searchItems, dateRange } = useStacMap();

  return useMemo(() => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return searchItems;
    }

    return searchItems.map((page) =>
      page.filter((item) => isItemWithinDateRange(item, dateRange)),
    );
  }, [searchItems, dateRange]);
}

export function useFilteredCollections() {
  const { collections, dateRange } = useStacMap();

  return useMemo(() => {
    if (!collections || (!dateRange.startDate && !dateRange.endDate)) {
      return collections;
    }

    return collections.filter((collection) => {
      // Filter based on collection temporal extent if available
      if (collection.extent?.temporal?.interval) {
        const intervals = collection.extent.temporal.interval;
        return intervals.some((interval) => {
          const [start, end] = interval;
          if (dateRange.startDate && end && new Date(end) < dateRange.startDate)
            return false;
          if (dateRange.endDate && start && new Date(start) > dateRange.endDate)
            return false;
          return true;
        });
      }
      return true;
    });
  }, [collections, dateRange]);
} 