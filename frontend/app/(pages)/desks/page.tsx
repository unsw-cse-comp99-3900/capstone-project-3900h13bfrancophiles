'use client';

import FloorPlanViewer from "@/components/FloorPlanViewer";
import { Tab, TabList, TabPanel, Tabs, Stack, Input, Button, Box, Sheet } from "@mui/joy";
import FilterListIcon from "@mui/icons-material/FilterList";
import { deskData } from '@/app/data';
import Image from "next/image";
import * as React from 'react';

export default function desks() {
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0].toString()
  );
  const [startTime, setStartTime] = React.useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endTime, setEndTime] = React.useState(
    new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [selectedDesk, setSelectedDesk] = React.useState("");

  return (
    <React.Fragment>
      <Sheet variant="plain" sx={{ boxShadow: "md", borderRadius: 10, zIndex: 2, position: "absolute", top: 60, right: 0, padding: 1, margin: 1 }}>
        <Stack direction="column">
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Input
              type="date"
              defaultValue={date}
              onChange={(event) => {
                const d = new Date(event.target.value)
                  .toISOString()
                  .split("T")[0];
                setDate(d);
              }}
            />
            <Stack direction="row">
              <Input
                type="time"
                defaultValue={startTime}
                size="sm"
                onChange={(event) => {
                  const d = new Date(event.target.value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setStartTime(d);
                }}
              />
              <Input
                type="time"
                defaultValue={endTime}
                size="sm"
                onChange={(event) => {
                  const d = new Date(event.target.value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setEndTime(d);
                }}
              />
            </Stack>
            <Button
              startDecorator={<FilterListIcon />}
              variant="outlined"
              color="neutral"
              size="sm"
              sx={{ backgroundColor: "#FBFCFE" }}
              onClick={() => (alert("toggled filter!"))}
            >
              Filter
            </Button>
          </Stack>
          <Box sx={{display: selectedDesk == "" ? "none" : "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
            <h2>
              Desk {selectedDesk}
            </h2>
            <Box sx={{ display: selectedDesk === "3" ? "flex" : "none", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
              <Image style={{ borderRadius: "50%" }}height={100} width={100} src="/franco.jpeg" alt="franco reyes"/>
              <h4>
                Franco Reyes
              </h4>
            </Box>
            <Button sx={{ display: selectedDesk === "3" ? "none" : "block" }}>
              Book now
            </Button>
          </Box>
        </Stack>
      </Sheet>
      <Tabs
        aria-label="level select"
        defaultValue={"K17L2"}
        sx={{ height: "calc(100vh - 60px)" }}
      >
        {deskData.map((level, index) => (
          <TabPanel
            key={index}
            variant="plain"
            color="neutral"
            value={level.level}
            sx={{
              height: "calc(100% - 45px)",
              padding: 0
            }}
          >
            <FloorPlanViewer setSelectedDesk={setSelectedDesk} level={level.level} />
          </TabPanel>
        ))}
        <TabList underlinePlacement="top" sx={{ height: 45 }}>
          {deskData.map((level, index) => (
            <Tab
              key={index}
              variant="plain"
              color="neutral"
              indicatorPlacement="top"
              value={level.level}
            >
              {level.level}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </React.Fragment>

  )
}