'use client';

import React from 'react';
import { KeepScale } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import Image from 'next/image';
import { deskData } from '@/app/data';
import DeskIcon from './DeskIcon';

interface FloorPlanProps {
  level: string;
}

const FloorPlan = ({level}: FloorPlanProps) => {
  const deskIconPosStyle: React.CSSProperties = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    zIndex: 2
  };

  const [desks, setDesks] = React.useState<{ id: number; x: string; y: string; }[]>([]);

  React.useEffect(() => {
    const levelData = deskData.find(data => data.level === level);
    setDesks(levelData ? levelData.desks : []);
  }, [level]);

  return (
    <Box sx={{ width: "100vh", position: 'relative'}}>
      <Image src={"/" + level + ".svg"} fill alt="floorplan" style={{position: "absolute", display: "block"}}/>
      {desks.map(desk => (
        <div
          key={desk.id}
          style={{
            ...deskIconPosStyle,
            left: desk.x,
            top: desk.y
          }}
        >
          <KeepScale >
            <DeskIcon id={desk.id} />
          </KeepScale>
        </div>
      ))}
    </Box>
  );
};

export default FloorPlan;
