import {
  DataList,
  Heading,
  Slider,
  Stack,
  type SliderValueChangeDetails,
} from "@chakra-ui/react";
import type {
  StacGeoparquetMetadata,
  StacSearch,
} from "./stac-geoparquet/context";
import { useStacGeoparquetDispatch } from "./stac-geoparquet/hooks";

export default function Filter({
  search,
  metadata,
}: {
  search: StacSearch;
  metadata: StacGeoparquetMetadata;
}) {
  const dispatch = useStacGeoparquetDispatch();
  const timeDelta =
    metadata.endDatetime.getTime() - metadata.startDatetime.getTime();

  function onDatetimeValueChange(details: SliderValueChangeDetails) {
    const startDatetime =
      metadata.startDatetime.getTime() + (details.value[0] * timeDelta) / 100;
    const endDatetime =
      metadata.startDatetime.getTime() + (details.value[1] * timeDelta) / 100;
    dispatch({
      type: "set-search",
      search: {
        ...search,
        startDatetime: new Date(startDatetime),
        endDatetime: new Date(endDatetime),
      },
    });
  }

  return (
    <Stack gapY={4}>
      <Heading size={"md"}>Datetime</Heading>
      <DataList.Root orientation={"horizontal"}>
        <DataList.Item>
          <DataList.ItemLabel>Start</DataList.ItemLabel>
          <DataList.ItemValue>
            {search.startDatetime.toLocaleString()}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>End</DataList.ItemLabel>
          <DataList.ItemValue>
            {search.endDatetime.toLocaleString()}
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
      <Slider.Root
        defaultValue={[0, 100]}
        onValueChange={onDatetimeValueChange}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
