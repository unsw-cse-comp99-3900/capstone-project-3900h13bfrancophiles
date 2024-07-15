"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  Modal,
  DialogActions,
  DialogContent,
  DialogTitle,
  ModalDialog,
  Divider,
} from "@mui/joy";
import { Booking } from "@/types";
import useSpace from "@/hooks/useSpace";
import useCurrentBookings from "@/hooks/useCurrentBookings";
import { format } from "date-fns";
import { useState } from "react";
import { checkIn, checkOut } from "@/api";

function CurrentBookings() {
  const { currentBookings } = useCurrentBookings();

  return currentBookings?.length ? (
    <>
      <Typography level="h2" mb={2}>
        Current Booking{currentBookings.length > 1 && "s"}
      </Typography>
      <Stack spacing={2}>
        {currentBookings.map((booking) => (
          <CurrentBookingCard key={booking.id} booking={booking} />
        ))}
      </Stack>
    </>
  ) : null;
}

interface CurrentBookingCardProps {
  booking: Booking;
}

function CurrentBookingCard({ booking }: CurrentBookingCardProps) {
  const { space, isLoading } = useSpace(booking.spaceid);
  const { mutate } = useCurrentBookings(); // Get mutate function from useCurrentBookings

  const [isCheckingInOrOut, setIsCheckingInOrOut] = useState(false);
  const [checkInOrOutError, setCheckInOrOutError] = useState<string | null>(
    null
  );
  const [checkedIn, setCheckedIn] = useState<boolean>(
    booking.currentstatus === "checkedin"
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [action, setAction] = useState<"checkIn" | "checkOut">();

  const handleCheckInOut = async () => {
    if (!action) return;

    setIsCheckingInOrOut(true);
    setCheckInOrOutError(null);

    try {
      if (action === "checkIn") {
        await checkIn(booking.id);
        setCheckedIn(true);
      } else {
        await checkOut(booking.id);
        setCheckedIn(false);
      }
      mutate();
    } catch (error) {
      if (error instanceof Error) {
        setCheckInOrOutError(error.message);
      } else {
        setCheckInOrOutError("An unexpected error occurred");
      }
    } finally {
      setIsCheckingInOrOut(false);
      setIsConfirmationOpen(false);
    }
  };

  const handleOpenConfirmation = (actionType: "checkIn" | "checkOut") => {
    setAction(actionType);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          px={2}
          py={1}
          width="100%"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
        >
          <Box>
            <Typography level="h3" sx={{ textWrap: "wrap" }}>
              <Skeleton loading={isLoading}>{space?.name}</Skeleton>
            </Typography>
            <Typography level="body-lg" pb={1} sx={{ textWrap: "wrap" }}>
              <Skeleton loading={isLoading}>
                Booked {format(new Date(booking.starttime), "p")} -{" "}
                {format(new Date(booking.endtime), "p")}
              </Skeleton>
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 4 }}
            height={60}
            width={{ xs: "100%", lg: "50%" }}
            py="10px"
            justifyContent="flex-end"
          >
            <Button
              size="sm"
              color="success"
              onClick={() =>
                handleOpenConfirmation(checkedIn ? "checkOut" : "checkIn")
              }
              sx={{ borderRadius: "20px", width: "100px" }}
              loading={isCheckingInOrOut}
            >
              {checkedIn ? "Check Out" : "Check In"}
            </Button>
            <Button
              size="sm"
              color="primary"
              sx={{ borderRadius: "20px", width: "150px" }}
            >
              Contact Support
            </Button>
          </Stack>
        </Stack>
      </CardContent>
      <Modal open={isConfirmationOpen} onClose={handleCloseConfirmation}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {action === "checkIn"
              ? "Check In Confirmation"
              : "Check Out Confirmation"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to{" "}
            {action === "checkIn" ? "check in" : "check out"}?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCheckInOut}
              color="success"
              loading={isCheckingInOrOut}
            >
              {action === "checkIn" ? "Check in" : "Check out"}?
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleCloseConfirmation}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Card>
  );
}

export default CurrentBookings;
