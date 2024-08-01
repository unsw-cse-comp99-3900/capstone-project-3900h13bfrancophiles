"use client";

import { Stack, Button, Sheet, Avatar, Typography, Link, IconButton } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { UserData } from "@/types";
import NextLink from "next/link";
import { Booking } from "@/types";
import { getInitials } from "@/utils/icons";

interface DeskInfoPopupProps {
  selectedDesk: string;
  booking: Booking | null;
  user: UserData | null;
  deskName: string;
  start: Date;
  end: Date;
  handleClose: () => void;
  openBookingModal: () => void;
}

const DeskInfoPopup = ({
  selectedDesk,
  booking,
  user,
  deskName,
  start,
  end,
  handleClose,
  openBookingModal,
}: DeskInfoPopupProps) => {
  const available = !booking;

  return (
    <Sheet
      variant="plain"
      sx={{
        display: selectedDesk ? "block" : "none",
        boxShadow: "md",
        borderRadius: 10,
        padding: 1.5,
        width: "100%",
      }}
    >
      <Stack direction="column" alignItems="left">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="h3">{deskName}</Typography>
          <IconButton size="sm" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Button
          sx={{ marginTop: 1, height: "60px", width: "100%", display: "block" }}
          onClick={openBookingModal}
          disabled={!!booking}
        >
          {available && (
            <Typography sx={{ color: "white" }}>
              Book for {timeNow(start)} - {timeNow(end)}
            </Typography>
          )}
          {!available && (
            <Stack direction="row">
              <Avatar
                variant="solid"
                color="primary"
                size="lg"
                src={
                  user?.name && user.name !== "anonymous"
                    ? `data:image/jpeg;base64,${user.image}`
                    : "defaultUser.svg"
                }
                alt={user ? user.name : "user"}
                sx={{
                  fontSize: { xs: "14pt", sm: "20pt" },
                  marginRight: 1.7,
                }}
              >
                {getInitials(user?.name ?? "")}
              </Avatar>
              <Stack alignItems="flex-start">
                <Typography>{user?.name ?? ""}</Typography>
                <Typography level="body-xs">
                  {timeNow(new Date(booking.starttime))} - {timeNow(new Date(booking.endtime))}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Button>
        <Link
          level="body-xs"
          sx={{ display: selectedDesk ? "block" : "none", paddingTop: 1, margin: "auto" }}
          component={NextLink}
          href={`/desks/${selectedDesk}`}
        >
          <Typography> View all availabilities</Typography>
        </Link>
      </Stack>
    </Sheet>
  );
};

function timeNow(i: Date) {
  return i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default DeskInfoPopup;
