import DateFilter from "./date-filter";
import useStacMap from "../hooks/stac-map";

export default function Filter() {
  const { 
    clientFilterDateRange, 
    setClientFilterDateRange, 
    clearClientFilterDateRange, 
    isClientFilterActive 
  } = useStacMap();

  return (
    <DateFilter
      dateRange={clientFilterDateRange}
      setDateRange={setClientFilterDateRange}
      clearDateRange={clearClientFilterDateRange}
      isDateFilterActive={isClientFilterActive}
      title="Client Filter"
      description="Filter items already loaded in the application"
    />
  );
} 