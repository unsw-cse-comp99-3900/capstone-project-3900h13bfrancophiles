'use client';

import React from 'react';
import Image from 'next/image';
import { KeepScale } from 'react-zoom-pan-pinch';
import { IconButton, Box } from '@mui/joy';
import { styled } from '@mui/system';

interface DeskIconProps {
  id: string,
  x: number,
  y: number,
  setSelectedDesk: React.Dispatch<React.SetStateAction<string>>
}

const buttonStyle = {
  padding: 0,
  borderRadius: "50%",
  zIndex: 2,
  overflow: "hidden",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  "&:active": {
    transform: "scale(0.95)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  },
};

const DeskIcon = ({ id, x, y, setSelectedDesk }: DeskIconProps) => {
  const [image, setImage] = React.useState("");
  React.useEffect(() => {
    if (id === "3") {
      setImage("/franco.jpeg") // placeholder: get actual image from the backend
    } else {
      setImage("/DeskIcon1.svg");
    }
  }, [id]);

  return (
    <Box
      key={id}
      sx={{
        "--size-var": { xs: "33px", sm: "45px", md: "50px" },
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        left: `${x}%`,
        top: `${y}%`
      }}
    >
      <KeepScale style={{height: "var(--size-var)", width: "var(--size-var)"}}>
        <IconButton variant="solid" color="primary" sx={{...buttonStyle, "--IconButton-size": "var(--size-var)" }} onClick={() => setSelectedDesk(id)}>
          <Image src={image} fill alt="desk"></Image>
        </IconButton>
      </KeepScale>
    </Box>
  );
};

export default DeskIcon;
