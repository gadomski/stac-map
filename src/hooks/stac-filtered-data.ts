import { useMemo } from "react";
import useStacMap from "./stac-map";
import { isItemWithinDateRange } from "../utils/date-filter";
import type { DateRange } from "../components/date-filter";

function isDateRangeActive(dateRange: DateRange): boolean {
  return (
    dateRange.startDate !== null ||
    dateRange.endDate !== null ||
    dateRange.startTime !== undefined ||
    dateRange.endTime !== undefined
  );
}

export function useFilteredSearchItems() {
  const { searchItems, dateRange } = useStacMap();

  return useMemo(() => {
    if (!isDateRangeActive(dateRange)) {
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
    if (!collections || !isDateRangeActive(dateRange)) {
      return collections;
    }

    return collections.filter((collection) => {
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
