'use client';

import React from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import FloorPlan from '@/app/components/FloorPlan';

interface FloorPlanViewerProps {
  activeLevel: string;
}

const FloorPlanViewer = ({activeLevel}: FloorPlanViewerProps) => {
  const viewerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center"
  };

  const contentStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative"
  };

  // const transformComponentRef = React.useRef<ReactZoomPanPinchRef | null>(null);

  // React.useEffect(() => {
  //   if (transformComponentRef.current) {
  //     transformComponentRef.current.resetTransform;
  //   }
  // }, [activeLevel]);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TransformWrapper
        // centerOnInit
        // initialScale={1.5}
        // initialPositionX={0}
        // initialPositionY={0}
        // ref={transformComponentRef}
        maxScale={3}
        disablePadding
      >
        <TransformComponent wrapperStyle={viewerStyle} contentStyle={viewerStyle}>
          <FloorPlan level={activeLevel}/>
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
