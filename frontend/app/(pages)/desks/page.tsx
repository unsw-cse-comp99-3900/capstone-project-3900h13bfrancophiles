'use client';

import FloorPlanViewer from "@/app/components/FloorPlanViewer";
import { Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { deskData } from '@/app/data';
import * as React from 'react';

export default function desks() {
  return (
    <Tabs
      aria-label="level select"
      defaultValue={"K17L2"}
      sx={{ height:  "calc(100vh - 60px)" }}
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
          <FloorPlanViewer level={level.level}/>
        </TabPanel>
      ))}
      <TabList underlinePlacement="top">
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
  )
}