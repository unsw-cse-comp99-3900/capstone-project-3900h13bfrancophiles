'use client';

import React, { useRef, useEffect, useState, createRef } from 'react';
import {
    TransformWrapper,
    TransformComponent,
    useControls,
    ReactZoomPanPinchContentRef
  } from "react-zoom-pan-pinch";
import { Box } from '@mui/joy';
import Image from 'next/image';

const FloorPlan = () => {
    const wrapperRef = createRef<ReactZoomPanPinchContentRef>();
    const wrapperStyle = {
        // border: "10px solid lightblue",
        //borderRadius: 30,
        //maxWidth: 2000,
        width:"100%",
        height: "100%",
        margin: 0,
        padding: 0
    };

    return (
        <Box
            sx={{
                //width: "100%",
                //height: "100%",
                //display: "flex",
                //justifyContent: "center"
            }}
        >
            <TransformWrapper
                centerOnInit
                initialScale={1.3}
                initialPositionX={0}
                initialPositionY={0}
                disablePadding
            >
                <TransformComponent wrapperStyle={wrapperStyle} contentStyle={wrapperStyle}>
                    <Image src="/K17L3.svg" height={1000} width={1000} alt="level 3" />
                </TransformComponent>
            </TransformWrapper>
        </Box>
    );
};

export default FloorPlan;
