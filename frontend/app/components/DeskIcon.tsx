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

  return (
    <div
      key={id}
      style={{
        ...deskIconPosStyle,
        left: `${x}%`,
        top: `${y}%`
      }}
      onClick={() => alert(`Desk ${id} clicked!`)}
    >
      <KeepScale>
        <div style={deskIconStyle} >
          <Image src="/deskicon.svg" width={40} height={40} alt="desk"></Image>
        </div>
      </KeepScale>
    </div>
  );
};

export default DeskIcon;