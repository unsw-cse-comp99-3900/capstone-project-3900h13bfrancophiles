'use client';

import React from 'react';
import Image from 'next/image';
import { KeepScale } from 'react-zoom-pan-pinch';

interface DeskIconProps {
  id: number,
  x: number,
  y: number
}

const DeskIcon = ({ id, x, y }: DeskIconProps) => {
  const deskIconStyle: React.CSSProperties = {
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 2
  };

  return (
    <KeepScale
      onClick={() => alert(`Desk ${id} clicked!`)}
      style= {{
      margin: 0,
      padding: 0,
      position: "absolute",
      transform: "translate(-50%, -50%)",
      left: `${x}%`,
      top: `${y}%`,
    }}>
      <Image style={deskIconStyle} src="/deskicon.svg" width={40} height={40} alt="desk" ></Image>
    </KeepScale>
  );
};

export default DeskIcon;
