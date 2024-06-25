'use client';

import React from 'react';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import Image from 'next/image';
import { deskData } from '@/app/data';
import DeskIcon from './DeskIcon';

interface FloorPlanViewerProps {
  level: string;
}

const FloorPlanViewer = ({ level }: FloorPlanViewerProps) => {
  const viewerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
  };

  const desks = deskData.find(data => data.level === level)?.desks ?? [];

  return (
    <Box sx={{ height: "100%", position: "relative", "--size-var": { xs: "500px", sm: "1000px", md: "1500px" } }}>
      <TransformWrapper
        maxScale={3}
        minScale={0.5}
        wheel={{ step: 0.015, smoothStep: 0.015 }}
        disablePadding
        centerOnInit
      >
        <TransformComponent
          wrapperStyle={viewerStyle}
          contentStyle={{ width: "var(--size-var)", height: "var(--size-var)", position: "relative" }}
        >
          <Image src={`/${level}.svg`} fill alt="floorplan" style={{ position: "absolute" }}/>
          {desks.map(desk => (
            <DeskIcon {...desk} />
          ))}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
