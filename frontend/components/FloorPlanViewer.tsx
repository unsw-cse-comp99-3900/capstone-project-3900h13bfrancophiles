"use client";

import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box } from "@mui/joy";
import Image from "next/image";
import DeskIcon from "./DeskIcon";
import { StatusResponse, UserData, DeskPosition } from "@/types";

interface FloorPlanViewerProps {
  selectedDesk: string;
  setSelectedDesk: React.Dispatch<React.SetStateAction<string>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  setDeskName: React.Dispatch<React.SetStateAction<string>>;
  floor: string;
  desks: DeskPosition[];
  statuses: StatusResponse;
}

const coordToPercent = (x: number) => {
  return x / 10;
};

const FloorPlanViewer = ({
  selectedDesk,
  setSelectedDesk,
  setSelectedUser,
  setAvailable,
  setDeskName,
  floor,
  desks,
  statuses,
}: FloorPlanViewerProps) => {
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
          {desks.map((desk, index) => (
            <DeskIcon
              key={index}
              id={desk.id}
              x={coordToPercent(desk.xcoord)}
              y={coordToPercent(desk.ycoord)}
              selectedDesk={selectedDesk}
              setSelectedDesk={setSelectedDesk}
              setSelectedUser={setSelectedUser}
              setAvailable={setAvailable}
              setDeskName={setDeskName}
              status={statuses[desk.id]}
            />
          ))}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default FloorPlanViewer;
