'use client';

import React from 'react';
import Image from 'next/image';

interface DeskIconProps {
  id: number;
}

const DeskIcon = ({ id }: DeskIconProps) => {

  const deskIconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  };

  return (
    <div style={{...deskIconStyle}} onClick={() => alert(`Desk ${id} clicked!`)}>
        <Image src="/deskicon.svg" fill alt="desk"></Image>
    </div>
  );
};

export default DeskIcon;
