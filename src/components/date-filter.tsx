import {
  Alert,
  Button,
  ButtonGroup,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCalendar, LuX } from "react-icons/lu";
import useStacMap from "../hooks/stac-map";
import { DATE_FILTER_PRESETS, isValidDateRange } from "../utils/date-filter";
import type { DateRange } from "../types/stac";

export default function DateFilter() {
  const { dateRange, setDateRange, clearDateRange, isDateFilterActive } = useStacMap();
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: typeof DATE_FILTER_PRESETS[0]) => {
    setDateRange(preset.getDateRange());
    setIsOpen(false);
  };

  const handleCustomDateChange = (field: keyof DateRange, value: Date | string | null) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    if (isValidDateRange(dateRange)) {
      setIsOpen(false);
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isDateFilterActive ? "solid" : "outline"}
          colorScheme={isDateFilterActive ? "blue" : "gray"}
          leftIcon={<LuCalendar />}
          rightIcon={isDateFilterActive ? <LuX /> : undefined}
          onClick={isDateFilterActive ? clearDateRange : undefined}
        >
          {isDateFilterActive ? "Date Filter Active" : "Filter by Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        p={4}
        width="100%"
        maxWidth="400px"
        boxSizing="border-box"
      >
        <VStack gap={4} align="stretch">
          <Text fontSize="sm" fontWeight="medium">Quick Presets</Text>
          <ButtonGroup size="sm" variant="outline">
            {DATE_FILTER_PRESETS.map(preset => (
              <Button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </ButtonGroup>

          <Text fontSize="sm" fontWeight="medium">Custom Range</Text>
          <HStack>
            <VStack align="stretch" flex={1}>
              <Text fontSize="xs">Start Date</Text>
              <Input
                type="date"
                value={dateRange.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleCustomDateChange('startDate', e.target.value ? new Date(e.target.value) : null)}
              />
            </VStack>
            <VStack align="stretch" flex={1}>
              <Text fontSize="xs">End Date</Text>
              <Input
                type="date"
                value={dateRange.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleCustomDateChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              />
            </VStack>
          </HStack>

          {!isValidDateRange(dateRange) && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>
                  Start date must be before or equal to end date
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <HStack>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={handleApply}
              disabled={!isValidDateRange(dateRange)}
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={clearDateRange}
            >
              Clear
            </Button>
          </HStack>
        </VStack>
      </PopoverContent>
    </Popover.Root>
  );
} 