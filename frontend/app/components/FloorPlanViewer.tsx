'use client';

import React from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import FloorPlan from '@/app/components/FloorPlan';

interface FloorPlanViewerProps {
  activeLevel: string;
}

const FloorPlanViewer = ({activeLevel}: FloorPlanViewerProps) => {
  const viewerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    justifyContent: "center"
  };

  return (
      <TransformWrapper
        maxScale={3}
        wheel={{step: 0.015, smoothStep: 0.015}}
        disablePadding
      >
        <TransformComponent wrapperStyle={viewerStyle} contentStyle={viewerStyle}>
          <FloorPlan level={activeLevel}/>
        </TransformComponent>
      </TransformWrapper>
  );
};

export default FloorPlanViewer;
