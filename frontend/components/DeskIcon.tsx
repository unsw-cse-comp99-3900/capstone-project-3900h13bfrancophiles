'use client';

import React from 'react';
import Image from 'next/image';
import { KeepScale } from 'react-zoom-pan-pinch';
import { Popover } from '@mui/material';
import { Tooltip, Box, Button } from '@mui/joy';

interface DeskIconProps {
  id: number,
  x: number,
  y: number
}

const DeskIcon = ({ id, x, y }: DeskIconProps) => {
  const deskIconPosStyle: React.CSSProperties = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    zIndex: 2
  };
  const deskIconStyle: React.CSSProperties = {
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 2
  };

  const [open, setOpen] = React.useState(false);

  return (
    <div
      key={id}
      style={{
        ...deskIconPosStyle,
        left: `${x}%`,
        top: `${y}%`
      }}

    >
      <KeepScale>
        <Tooltip
          placement="top"
          open={open}
          disableHoverListener
          disableFocusListener
          describeChild={false}
          title={
            <Box sx={{ padding: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              <Button>
                Book desk { id }
              </Button>
            </Box>
          }
          variant="plain"
        >
          <div style={deskIconStyle} onClick={() => setOpen(!open)}>
            <Image src="/deskicon.svg" width={40} height={40} alt="desk"></Image>
          </div>
        </Tooltip>
      </KeepScale>
    </div>
  );
};

export default DeskIcon;