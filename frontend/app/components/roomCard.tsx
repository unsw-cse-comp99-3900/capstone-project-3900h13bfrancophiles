"use client";

import * as React from "react";
import {Button, Card, CardContent, CardOverflow, Typography} from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import IconButton from '@mui/material/IconButton';

export default function RoomCard() {
  // TODO: set status based on database for the room
  const [avalible, setAvalible] = React.useState(true);

  return (
    <Card sx={{ width: 230, maxWidth: "100%", boxShadow: "lg", background: "#F0F4F8"}}>
      <CardContent>
        {/* TODO: Make link to the cal for individual room page */}
        <div
          style={{
            display: "inline-flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
            {/* TODO: Make Varible from data */}
            K17 G02
          </Typography>
          {/* <IconButton>{<EditCalendarOutlinedIcon />}</IconButton> */}
        </div>
        <Typography
          level="body-sm"
          startDecorator={<MeetingRoomOutlinedIcon />}
        >
          {/* TODO: Make Varible from data */}
          Consultation Room
        </Typography>
        <Typography level="body-sm" startDecorator={<PeopleIcon />}>
          {/* TODO: Make Varible from data */}
          25
        </Typography>
      </CardContent>
      <CardOverflow>
        <Button
          variant="solid"
          color={avalible ? "success" : "danger"}
          size="lg"
        >
          {/* TODO: Make Varible from data */}
          {avalible ? "Avalible" : "Unavalible"}
        </Button>
      </CardOverflow>
    </Card>
  );
}
