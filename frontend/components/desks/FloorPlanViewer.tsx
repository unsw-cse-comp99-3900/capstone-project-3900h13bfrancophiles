"use client";

import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box, CircularProgress } from "@mui/joy";
import Image from "next/image";
import DeskIcon from "./DeskIcon";
import { StatusResponse, DeskPosition } from "@/types";

interface FloorPlanViewerProps {
  date: Date;
  start: Date;
  end: Date;
  floor: string;
  desks: DeskPosition[];
  statuses: StatusResponse;
  isLoading: boolean;
}

/**
 * Convert backend coordinate to offset percentage
 * @param x coordinate
 */
const coordToPercent = (x: number) => {
  return x / 10;
};

const FloorPlanViewer = ({
  date,
  start,
  end,
  floor,
  desks,
  statuses,
  isLoading,
}: FloorPlanViewerProps) => {
  const [selectedDesk, setSelectedDesk] = React.useState("");

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        "--size-var": { xs: "500px", sm: "1000px", md: "1500px" },
      }}
    >
      <TransformWrapper
        maxScale={3}
        minScale={0.75}
        wheel={{ step: 0.015, smoothStep: 0.015 }}
        disablePadding
        centerOnInit
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%", position: "relative" }}
          contentStyle={{
            width: "var(--size-var)",
            height: "var(--size-var)",
            position: "relative",
          }}
        >
          <Image
            src={`/${floor}.svg`}
            fill
            alt={`${floor} floorplan`}
            style={{ position: "absolute" }}
          />
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.25)",
              }}
            >
              <CircularProgress size="lg" />
            </Box>
          )}
          {!isLoading &&
            desks.map((desk, index) => (
              <DeskIcon
                key={index}
                id={desk.id}
                x={coordToPercent(desk.xcoord)}
                y={coordToPercent(desk.ycoord)}
                date={date}
                start={start}
                end={end}
                status={statuses[desk.id]}
                selectedDesk={selectedDesk}
                setSelectedDesk={setSelectedDesk}
              />
            ))}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
