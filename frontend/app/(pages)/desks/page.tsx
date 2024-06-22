'use client';

import FloorPlanViewer from "@/app/components/FloorPlanViewer";
import LevelSelectFooter from "@/app/components/LevelSelectFooter";
import { Stack } from "@mui/joy";
import * as React from 'react';



export default function desks() {
    const [activeLevel, setActiveLevel] = React.useState("K17L3");
    const levelData = ["K17L2", "K17L3", "K17L4", "K17L5"];

    return (
        <Stack sx={{
            height: "calc(100vh - 60px)",
            direction: "column",
            justifyContent: "space-between",
        }}>
            <FloorPlanViewer activeLevel={activeLevel}/>
            <LevelSelectFooter levelData={levelData} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
        </Stack>
    )
}