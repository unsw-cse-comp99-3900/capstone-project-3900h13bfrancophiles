'use client';

import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import Image from 'next/image';

const FloorPlan = () => {
    const transformStyle: React.CSSProperties = {
        width:"100%",
        height: "100%",
        position: "relative"
    };

    return (
        <Box sx={{ height: "100%" }}>
            <TransformWrapper
                centerOnInit
                initialScale={1.5}
                initialPositionX={0}
                initialPositionY={0}
                maxScale={3}
                disablePadding
            >
                <TransformComponent wrapperStyle={transformStyle} contentStyle={transformStyle}>
                    <Image src="/K17L3.svg" fill alt="level 3" />
                </TransformComponent>
            </TransformWrapper>
        </Box>
    );
};

export default FloorPlan;
