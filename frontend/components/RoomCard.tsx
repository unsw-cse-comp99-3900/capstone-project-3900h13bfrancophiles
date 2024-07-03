"use client";

import * as React from "react";
import { Card, CardContent, CardOverflow, Stack, Typography } from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { Room } from "@/types";

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Card
      sx={{
        width: 230,
        maxWidth: "100%",
        boxShadow: "lg",
        background: "#F0F4F8",
      }}
    >
      <CardContent>
        <Stack spacing={"10px"}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexDirection: "row" }}
          >
            <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
              {room.name}
            </Typography>
            <FontAwesomeIcon fontSize="24px" icon={faCalendarPlus} />
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
        color={"success"}
        // color={room.available ? "success" : "danger"}
        sx={{ padding: "8px", alignItems: "center", flexWrap: "wrap" }}
      >
        {/* <b>{room.available ? "Available" : "Unavailable"}</b> */}
        <b>Available</b>

      </CardOverflow>
    </Card>
  );
}
