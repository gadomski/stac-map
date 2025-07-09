import {
  Button,
  Card,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuCalendar, LuX } from "react-icons/lu";
import { useStacMap } from "../../hooks";

export default function DateFilter() {
  const { dateRange, setDateRange } = useStacMap();

  const handleStartDateChange = (value: string) => {
    const currentStartTime = dateRange?.startTime || "00:00";
    setDateRange({
      startDate: value || null,
      startTime: currentStartTime,
      endDate: dateRange?.endDate || null,
      endTime: dateRange?.endTime || "23:59",
    });
  };

  const handleStartTimeChange = (value: string) => {
    setDateRange({
      startDate: dateRange?.startDate || null,
      startTime: value || "00:00",
      endDate: dateRange?.endDate || null,
      endTime: dateRange?.endTime || "23:59",
    });
  };

  const handleEndDateChange = (value: string) => {
    const currentEndTime = dateRange?.endTime || "23:59";
    setDateRange({
      startDate: dateRange?.startDate || null,
      startTime: dateRange?.startTime || "00:00",
      endDate: value || null,
      endTime: currentEndTime,
    });
  };

  const handleEndTimeChange = (value: string) => {
    setDateRange({
      startDate: dateRange?.startDate || null,
      startTime: dateRange?.startTime || "00:00",
      endDate: dateRange?.endDate || null,
      endTime: value || "23:59",
    });
  };

  const handleClearFilter = () => {
    setDateRange(null);
  };

  const isFilterActive = dateRange && (dateRange.startDate || dateRange.endDate);

  return (
    <Card.Root variant="outline">
      <Card.Header pb={2}>
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <LuCalendar size={16} />
            <Text fontWeight="medium">Date & Time Range Filter</Text>
          </HStack>
          {isFilterActive && (
            <Button
              size="xs"
              variant="ghost"
              onClick={handleClearFilter}
            >
              <LuX size={12} /> Clear
            </Button>
          )}
        </HStack>
      </Card.Header>
      <Card.Body pt={0}>
        <VStack gap={3} align="stretch">
          <Stack gap={2}>
            <Text as="label" fontSize="sm" fontWeight="medium">
              Start Date & Time
            </Text>
            <HStack gap={2}>
              <Input
                id="start-date"
                type="date"
                value={dateRange?.startDate || ""}
                onChange={(e) => handleStartDateChange(e.target.value)}
                placeholder="Select start date"
                size="sm"
                flex={2}
              />
              <Input
                id="start-time"
                type="time"
                value={dateRange?.startTime || "00:00"}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                size="sm"
                flex={1}
              />
            </HStack>
          </Stack>

          <Stack gap={2}>
            <Text as="label" fontSize="sm" fontWeight="medium">
              End Date & Time
            </Text>
            <HStack gap={2}>
              <Input
                id="end-date"
                type="date"
                value={dateRange?.endDate || ""}
                onChange={(e) => handleEndDateChange(e.target.value)}
                placeholder="Select end date"
                size="sm"
                flex={2}
                min={dateRange?.startDate || undefined}
              />
              <Input
                id="end-time"
                type="time"
                value={dateRange?.endTime || "23:59"}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                size="sm"
                flex={1}
              />
            </HStack>
          </Stack>

          {isFilterActive && (
            <Card.Root variant="elevated" bg="blue.50" borderColor="blue.200">
              <Card.Body py={2}>
                <Text fontSize="sm" color="blue.700">
                  <strong>Active Filter:</strong>{" "}
                  {dateRange?.startDate && dateRange?.endDate
                    ? `${formatDateTime(dateRange.startDate, dateRange.startTime || "00:00")} to ${formatDateTime(dateRange.endDate, dateRange.endTime || "23:59")}`
                    : dateRange?.startDate
                    ? `From ${formatDateTime(dateRange.startDate, dateRange.startTime || "00:00")}`
                    : `Until ${formatDateTime(dateRange.endDate!, dateRange.endTime || "23:59")}`}
                </Text>
              </Card.Body>
            </Card.Root>
          )}

          {dateRange?.startDate && dateRange?.endDate && (
            <Text fontSize="xs" color="fg.muted">
              Showing items between {formatDateTime(dateRange.startDate, dateRange.startTime || "00:00")} and{" "}
              {formatDateTime(dateRange.endDate, dateRange.endTime || "23:59")}
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function formatDateTime(dateString: string, timeString: string): string {
  const date = new Date(`${dateString}T${timeString}`);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
} 