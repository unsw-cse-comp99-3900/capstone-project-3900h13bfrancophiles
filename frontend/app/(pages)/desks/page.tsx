'use client';

import FloorPlan from "@/app/components/FloorPlan";
import LevelSelectFooter from "@/app/components/LevelSelectFooter";
import { Box, Stack, Typography, Button, Sheet } from "@mui/joy";
import * as React from 'react';



export default function desks() {
    const [activeLevel, setActiveLevel] = React.useState("K17L3");
    const levelData = ["K17L2", "K17L3", "K17L4", "K17L5"];

    return (
        <Stack sx={{
            //width: "100%",
            //height: "100%",
            direction: "column",
        }}>
            <FloorPlan />
            <LevelSelectFooter levelData={levelData} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
        </Stack>
    )
}