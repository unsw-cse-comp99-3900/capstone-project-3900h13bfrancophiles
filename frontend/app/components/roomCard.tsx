"use client";

import * as React from "react";
import {Card, CardContent, CardOverflow, Stack, Typography } from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";

export default function RoomCard() {
  // TODO: set status based on database for the room
  const [available, setAvailable] = React.useState(true);

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
        {/* TODO: Make link to the cal for individual room page */}
        <Stack spacing={'10px'}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexDirection: "row" }}
          >
            <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
              {/* TODO: Make Variable from data */}
              K17 G02
            </Typography>
            <EditCalendarOutlinedIcon />
          </Stack>
          <Typography
            level="body-sm"
            startDecorator={<MeetingRoomOutlinedIcon />}
          >
            {/* TODO: Make Variable from data */}
            Consultation Room
          </Typography>
          <Typography level="body-sm" startDecorator={<PeopleIcon />}>
            {/* TODO: Make Variable from data */}
            25
          </Typography>
        </Stack>
      </CardContent>
      <CardOverflow
        variant="solid"
        color={available ? "success" : "danger"}
        sx={{ padding: "8px", alignItems: "center", flexWrap: "wrap" }}
      >
        <b>{available ? "Available" : "Unavailable"}</b>
      </CardOverflow>
    </Card>
  );
}
