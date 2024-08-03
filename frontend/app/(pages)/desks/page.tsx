"use client";

import FloorPlanViewer from "@/components/desks/FloorPlanViewer";
import {
  FormControl,
  Input,
  Sheet,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import * as React from "react";
import useTimeRange from "@/hooks/useTimeRange";
import useSpaceStatus from "@/hooks/useSpaceStatus";
import JoyTimePicker from "@/components/JoyTimePicker";
import useDesks from "@/hooks/useDesks";
import Box from "@mui/joy/Box";

const floors = ["K17 L2", "K17 L3", "K17 L4", "K17 L5"];

export default function Desks() {
  const { date, start, end, dateInputProps, startTimePickerProps, endTimePickerProps } =
    useTimeRange();

  const { desks } = useDesks();
  const { statusResponse, isLoading } = useSpaceStatus(start.toISOString(), end.toISOString());

  // Prevent zooming (https://stackoverflow.com/a/38573198)
  React.useEffect(() => {
    const preventZoom = (event: TouchEvent) => {
      if ("scale" in event && event.scale !== 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventZoom, false);
    return () => document.removeEventListener("touchmove", preventZoom, false);
  }, []);

  return (
    <Box height="calc(100% - 60px)" sx={{ touchAction: "none" }}>
      <Stack
        direction="column"
        alignItems="flex-end"
        sx={{
          zIndex: 2,
          position: "absolute",
          top: 60,
          right: 0,
          padding: 1,
          marginY: 1,
          marginX: { xs: "16px", sm: 1 },
          width: { xs: "calc(100vw - 32px)", sm: "auto" },
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            boxShadow: "md",
            borderRadius: 10,
            padding: 1.5,
            marginBottom: 1.5,
            width: "100%",
          }}
        >
          <Stack direction="column">
            <Typography level="h4">Search for available desks:</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2 }} mt={1} mb={1}>
              <FormControl sx={{ xs: "100%", sm: 150 }}>
                <Input {...dateInputProps} />
              </FormControl>
              <Stack direction="row" spacing={2} width={{ xs: "100%", sm: 270 }}>
                <JoyTimePicker sx={{ pl: 0 }} {...startTimePickerProps} />
                <JoyTimePicker sx={{ pl: 0 }} {...endTimePickerProps} />
              </Stack>
            </Stack>
          </Stack>
        </Sheet>
      </Stack>
      <Tabs aria-label="level select" defaultValue={"K17 L2"} sx={{ height: "100%" }}>
        {floors.map((floor, index) => (
          <TabPanel
            key={index}
            variant="plain"
            color="neutral"
            value={floor}
            sx={{
              height: "calc(100% - 45px)",
              padding: 0,
            }}
          >
            <FloorPlanViewer
              date={date}
              start={start}
              end={end}
              floor={floor}
              desks={desks?.filter((desk) => desk.floor === floor) || []}
              statuses={statusResponse || {}}
              isLoading={isLoading}
            />
          </TabPanel>
        ))}
        <TabList underlinePlacement="top" sx={{ height: 45 }}>
          {floors.map((floor, index) => (
            <Tab key={index} variant="plain" color="neutral" indicatorPlacement="top" value={floor}>
              {floor}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </Box>
  );
}
