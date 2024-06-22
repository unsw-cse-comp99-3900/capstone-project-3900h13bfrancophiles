"use client";

import * as React from "react";
import {Card, CardContent, CardOverflow, Stack, Typography } from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";

export type RoomData = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  available: boolean;
};

interface RoomCardProps {
  room: RoomData;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Card
      sx={{
        width: 230,
        maxWidth: "100%",
        boxShadow: "lg",
        background: "#F0F4F8",
        marginTop: "20px",
      }}
    >
      <CardContent>
        <Stack spacing={'10px'}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexDirection: "row" }}
          >
            <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
              {room.name}
            </Typography>
            <EditCalendarOutlinedIcon />
          </Stack>
          <Typography
            level="body-sm"
            startDecorator={<MeetingRoomOutlinedIcon />}
          >
            {room.type}
          </Typography>
          <Typography level="body-sm" startDecorator={<PeopleIcon />}>
            {room.capacity}
          </Typography>
        </Stack>
      </CardContent>
      <CardOverflow
        variant="solid"
        color={room.available ? "success" : "danger"}
        sx={{ padding: "8px", alignItems: "center", flexWrap: "wrap" }}
      >
        <b>{room.available ? "Available" : "Unavailable"}</b>
      </CardOverflow>
    </Card>
  );
}

