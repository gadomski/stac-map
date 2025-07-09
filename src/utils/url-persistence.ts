import type { DateRange } from "../types/stac";

export function serializeDateRange(dateRange: DateRange): string | null {
  if (!dateRange.startDate && !dateRange.endDate) return null;

  const params = new URLSearchParams();
  if (dateRange.startDate) {
    params.set("startDate", dateRange.startDate.toISOString());
  }
  if (dateRange.endDate) {
    params.set("endDate", dateRange.endDate.toISOString());
  }
  if (dateRange.startTime) {
    params.set("startTime", dateRange.startTime);
  }
  if (dateRange.endTime) {
    params.set("endTime", dateRange.endTime);
  }

  return params.toString();
}

export function deserializeDateRange(searchParams: URLSearchParams): DateRange {
  return {
    startDate: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null,
    endDate: searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : null,
    startTime: searchParams.get("startTime") || undefined,
    endTime: searchParams.get("endTime") || undefined,
  };
}
