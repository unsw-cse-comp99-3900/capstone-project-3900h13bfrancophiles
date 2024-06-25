'use client';

import React from 'react';
import { Box } from '@mui/joy';
import Image from 'next/image';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { deskData } from '@/app/data';
import DeskIcon from './DeskIcon';

interface FloorPlanViewerProps {
  level: string;
}

const FloorPlanViewer = ({level}: FloorPlanViewerProps) => {
  const viewerStyle: React.CSSProperties = {
    //width: "100%",
    //height: "100%",
    //display: "flex",
    position: "relative",
    //justifyContent: "center"
  };

  var desks: {id: number, x: number, y: number}[] = [];
  const levelData = deskData.find(data => data.level === level);
  if (levelData) {
    desks = levelData.desks;
  } else {
    desks = [];
  }

  return (
    <Box sx={{ height: "100%", position: "relative", "--size-var": { xs: "500px", sm: "1000px", md: "1500px" }}}>
      <TransformWrapper
        maxScale={3}
        minScale= {0.5}
        wheel={{step: 0.015, smoothStep: 0.015}}
        disablePadding
        centerOnInit
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%", ...viewerStyle}} contentStyle={{ width: "var(--size-var)", height: "var(--size-var)" }}>
            <Image src={"/" + level + ".svg"} fill alt="floorplan" style={{ position: "absolute" }}/>
            {desks.map(desk => (
              <DeskIcon key={desk.id} id={desk.id} x={desk.x} y={desk.y} />
            ))}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
