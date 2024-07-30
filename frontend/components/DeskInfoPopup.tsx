"use client";

import {
  Stack,
  Button,
  Box,
  Sheet,
  Avatar,
  Typography,
  Link,
  IconButton,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { UserData } from "@/types";
import NextLink from "next/link";
import { Booking} from "@/types";
import useSpace from "@/hooks/useSpace";

interface DeskInfoPopupProps {
  selectedDesk: string,
  booking: Booking | null,
  user: UserData | null,
  deskName: string,
  handleClose: () => void,
  openBookingModal: () => void,
}

const DeskInfoPopup = ({
  selectedDesk,
  booking,
  user,
  deskName,
  handleClose,
  openBookingModal
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
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography component="h2">{deskName}</Typography>
          <IconButton size="sm" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Button
          sx={{ display: available ? "block" : "none", marginTop: 1, width: "100%" }}
          onClick={openBookingModal}
        >
          Book {deskName}
        </Button>
        <Box
          sx={{
            display: available ? "none" : "flex",
            flexDirection: { xs: "row", sm: "column" },
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="solid"
            color="primary"
            src={
              user?.name && user.name !== "anonymous"
                ? `data:image/jpeg;base64,${user.image}`
                : "defaultUser.svg"
            }
            alt={user ? user.name : "user"}
            sx={{
              fontSize: { xs: "14pt", sm: "20pt" },
              height: { xs: "70px", sm: "100px" },
              width: { xs: "70px", sm: "100px" },
              margin: 1,
            }}
          >
            {getInitials(user?.name ?? "")}
          </Avatar>
          <Typography>{user?.name ?? ""}</Typography>
        </Box>
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
  )
}

function getInitials(name: string) {
  const words = name.trim().split(" ", 2);
  const firstLetter = words[0] ? words[0][0] : "";
  const secondLetter = words[1] ? words[1][0] : "";
  return (firstLetter + secondLetter).toUpperCase();
}

export default DeskInfoPopup;