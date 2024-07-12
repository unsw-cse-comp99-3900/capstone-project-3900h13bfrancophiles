"use client";

import * as React from "react";
import { Card, CardContent, CardOverflow, IconButton, Link, Stack, Typography } from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  handleBook: (room: Room) => void;
}


const RoomCard: React.FC<RoomCardProps> = ({ room, handleBook }) => {
  return (
    <Card
      sx={{
        width: "100%",
        marginX: "auto",
        maxWidth: "100%",
        boxShadow: "lg",
        "&:hover": {
          transform: "scale(1.05)",
          transition: "all .2s ease-in-out;"
        }
      }}
    >
      <CardContent>
        <Stack spacing={"10px"}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexDirection: "row" }}
          >
            <Link
              overlay
              href={`/space/${room.id}`}
              underline="none"
            >
              <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
                {room.name}
              </Typography>
            </Link>
            <IconButton onClick={() => handleBook(room)}>
              <FontAwesomeIcon fontSize="24px" icon={faCalendarPlus} />
            </IconButton>
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

export default RoomCard;
