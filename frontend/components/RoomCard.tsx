"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardOverflow,
  IconButton,
  Stack,
  Typography,
  Link
} from "@mui/joy";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { Room } from "@/types";
import useSpaceStatus from "@/hooks/useSpaceStatus";
interface RoomCardProps {
  room: Room;
  handleBook: (room: Room) => void;
  datetimeStart: string;
  datetimeEnd: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  handleBook,
  datetimeStart,
  datetimeEnd,
}) => {
  const { statusResponse, isLoading, error } = useSpaceStatus(
    datetimeStart,
    datetimeEnd
  );

  let availability = "";

  if (error) {
    availability = "Error";
  } else if (statusResponse) {
    availability = statusResponse[room.id].status;
  }

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
        color={
          availability === "Available"
            ? "success"
            : availability === "Unavailable"
            ? "danger"
            : "neutral"
        }
        sx={{ padding: "8px", alignItems: "center", flexWrap: "wrap" }}
      >
        <b>{availability}</b>
      </CardOverflow>
    </Card>
  );
};

export default RoomCard;