'use client';

import React from 'react';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import Image from 'next/image';
import { deskData } from '@/app/data';
import DeskIcon from './DeskIcon';

interface FloorPlanViewerProps {
  setSelectedDesk: React.Dispatch<React.SetStateAction<string>>;
  level: string;
  // TODO: timestamp passed down
}

const FloorPlanViewer = ({ level, setSelectedDesk }: FloorPlanViewerProps) => {
  const desks = deskData.find(data => data.level === level)?.desks ?? [];

  return (
    <Box sx={{ height: "100%", position: "relative", "--size-var": { xs: "500px", sm: "1000px", md: "1500px" } }}>
      <TransformWrapper
        maxScale={3}
        minScale={1}
        wheel={{ step: 0.015, smoothStep: 0.015 }}
        disablePadding
        centerOnInit
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%", position: "relative" }}
          contentStyle={{ width: "var(--size-var)", height: "var(--size-var)", position: "relative" }}
        >
          <Image src={`/${level}.svg`} fill alt={`${level} floorplan`} style={{ position: "absolute" }}/>
          {desks.map((desk, index) => (
            <DeskIcon key={index} {...{...desk, setSelectedDesk}} />
          ))}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
