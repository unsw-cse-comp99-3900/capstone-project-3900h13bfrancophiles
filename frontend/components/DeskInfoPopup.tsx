"use client";

import { Stack, Button, Sheet, Avatar, Typography, Link, IconButton } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { UserData } from "@/types";
import NextLink from "next/link";
import { Booking } from "@/types";
import { useFloating, flip, shift, autoUpdate, ReferenceType, offset } from "@floating-ui/react";
import BookingModal from "@/components/BookingModal/BookingModal";
import { getInitials } from "@/utils/icons";

interface DeskInfoPopupProps {
  id: string;
  deskName: string;
  booking: Booking | null;
  user: UserData | null;
  date: Date;
  start: Date;
  end: Date;
  handleClose: () => void;
  reference: ReferenceType | null;
}

const DeskInfoPopup = ({
  id,
  deskName,
  booking,
  user,
  date,
  start,
  end,
  handleClose,
  reference,
}: DeskInfoPopupProps) => {
  const available = !booking;
  const [open, setOpen] = React.useState<boolean>(false);

  const { x, y, strategy, refs } = useFloating({
    placement: "right",
    middleware: [offset(10), flip({ fallbackAxisSideDirection: "start" }), shift()],
    whileElementsMounted: autoUpdate,
  });

  React.useEffect(() => {
    if (reference) {
      refs.setReference(reference);
    }
  }, [reference, refs]);

  return (
    <React.Fragment>
      {open && (
        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          space={{ id, name: deskName, isRoom: false }}
          date={date}
          start={start}
          end={end}
        />
      )}
      <Sheet
        variant="plain"
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 10,
          padding: "10px",
          margin: "10px",
          width: "300px",
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
            onClick={() => setOpen(true)}
            color="success"
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
            sx={{ paddingTop: 1, margin: "auto" }}
            component={NextLink}
            href={`/desks/${id}`}
          >
            <Typography> View all availabilities</Typography>
          </Link>
        </Stack>
      </Sheet>
    </React.Fragment>
  );
};

function timeNow(i: Date) {
  return i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default DeskInfoPopup;
