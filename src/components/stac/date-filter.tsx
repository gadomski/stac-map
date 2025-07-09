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
    setDateRange({
      startDate: value || null,
      endDate: dateRange?.endDate || null,
    });
  };

  const handleEndDateChange = (value: string) => {
    setDateRange({
      startDate: dateRange?.startDate || null,
      endDate: value || null,
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
            <Text fontWeight="medium">Date Range Filter</Text>
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
              Start Date
            </Text>
            <Input
              id="start-date"
              type="date"
              value={dateRange?.startDate || ""}
              onChange={(e) => handleStartDateChange(e.target.value)}
              placeholder="Select start date"
              size="sm"
            />
          </Stack>

          <Stack gap={2}>
            <Text as="label" fontSize="sm" fontWeight="medium">
              End Date
            </Text>
            <Input
              id="end-date"
              type="date"
              value={dateRange?.endDate || ""}
              onChange={(e) => handleEndDateChange(e.target.value)}
              placeholder="Select end date"
              size="sm"
              min={dateRange?.startDate || undefined}
            />
          </Stack>

          {isFilterActive && (
            <Card.Root variant="elevated" bg="blue.50" borderColor="blue.200">
              <Card.Body py={2}>
                <Text fontSize="sm" color="blue.700">
                  <strong>Active Filter:</strong>{" "}
                  {dateRange?.startDate && dateRange?.endDate
                    ? `${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`
                    : dateRange?.startDate
                    ? `From ${formatDate(dateRange.startDate)}`
                    : `Until ${formatDate(dateRange.endDate!)}`}
                </Text>
              </Card.Body>
            </Card.Root>
          )}

          {dateRange?.startDate && dateRange?.endDate && (
            <Text fontSize="xs" color="fg.muted">
              Showing items between {formatDate(dateRange.startDate)} and{" "}
              {formatDate(dateRange.endDate)}
            </Text>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
} 