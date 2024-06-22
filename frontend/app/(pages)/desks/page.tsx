'use client';

import FloorPlan from "@/app/components/FloorPlan";
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
            <FloorPlan />
            <LevelSelectFooter levelData={levelData} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
        </Stack>
    )
}