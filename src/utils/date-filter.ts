import type { StacItem } from "stac-ts";
import type { DateRange, DateFilterPreset } from "../types/stac";

function createDateTime(date: Date, time?: string): Date {
  if (!time) return date;
  
  const [hours, minutes] = time.split(":").map(Number);
  const datetime = new Date(date);
  datetime.setHours(hours, minutes, 0, 0);
  return datetime;
}

function getEffectiveStartDateTime(dateRange: DateRange): Date | null {
  if (!dateRange.startDate) return null;
  return createDateTime(dateRange.startDate, dateRange.startTime);
}

function getEffectiveEndDateTime(dateRange: DateRange): Date | null {
  if (!dateRange.endDate) return null;
  return createDateTime(dateRange.endDate, dateRange.endTime);
}

export function isItemWithinDateRange(
  item: StacItem,
  dateRange: DateRange,
): boolean {
  if (!dateRange.startDate && !dateRange.endDate) return true;

  const itemDate = new Date(
    item.properties?.datetime ||
      item.properties?.start_datetime ||
      item.properties?.end_datetime,
  );

  const effectiveStartDate = getEffectiveStartDateTime(dateRange);
  const effectiveEndDate = getEffectiveEndDateTime(dateRange);

  if (effectiveStartDate && itemDate < effectiveStartDate) return false;
  if (effectiveEndDate && itemDate > effectiveEndDate) return false;

  return true;
}

export function formatDateRangeForStacSearch(
  dateRange: DateRange,
): string | null {
  if (!dateRange.startDate && !dateRange.endDate) return null;

  const effectiveStartDate = getEffectiveStartDateTime(dateRange);
  const effectiveEndDate = getEffectiveEndDateTime(dateRange);

  const start = effectiveStartDate?.toISOString() || "..";
  const end = effectiveEndDate?.toISOString() || "..";

  return `${start}/${end}`;
}

export function parseDateTime(dateString: string, timeString?: string): Date {
  const date = new Date(dateString);
  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  }
  return date;
}

export function isValidDateRange(dateRange: DateRange): boolean {
  if (!dateRange.startDate && !dateRange.endDate) return true;
  
  const effectiveStartDate = getEffectiveStartDateTime(dateRange);
  const effectiveEndDate = getEffectiveEndDateTime(dateRange);
  
  if (effectiveStartDate && effectiveEndDate) {
    return effectiveStartDate <= effectiveEndDate;
  }
  return true;
}

export const DATE_FILTER_PRESETS: DateFilterPreset[] = [
  {
    id: "last24h",
    label: "Last 24 hours",
    getDateRange: () => ({
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
    }),
  },
  {
    id: "last7d",
    label: "Last 7 days",
    getDateRange: () => ({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    }),
  },
  {
    id: "last30d",
    label: "Last 30 days",
    getDateRange: () => ({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    }),
  },
  {
    id: "thisYear",
    label: "This year",
    getDateRange: () => ({
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(),
    }),
  },
]; 