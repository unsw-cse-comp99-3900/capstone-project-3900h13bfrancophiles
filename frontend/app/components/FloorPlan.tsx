'use client';

import React from 'react';
import { Box, AspectRatio } from '@mui/joy';
import Image from 'next/image';
import { deskData } from '@/app/data';
import DeskIcon from './DeskIcon';

interface FloorPlanProps {
  level: string;
}

const FloorPlan = ({level}: FloorPlanProps) => {
  var desks: {id: number, x: number, y: number}[] = [];
  const levelData = deskData.find(data => data.level === level);
  if (levelData) {
    desks = levelData.desks;
  } else {
    desks = [];
  }

  return (
    <Box sx={{ width: 1000, position: 'relative' }}>
      <Image src={"/" + level + ".svg"} fill alt="floorplan" style={{ position: "absolute" }}/>
      {desks.map(desk => (
        <DeskIcon key={desk.id} id={desk.id} x={desk.x} y={desk.y} />
      ))}
    </Box >
  );
};

export default FloorPlan;
