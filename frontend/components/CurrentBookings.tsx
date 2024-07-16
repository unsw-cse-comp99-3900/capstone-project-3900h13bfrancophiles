"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import { Booking } from "@/types";
import useSpace from "@/hooks/useSpace";
import useCurrentBookings from "@/hooks/useCurrentBookings";
import { format } from "date-fns";
import { useState } from "react";
import { checkIn, checkOut } from "@/api";
import { mutate } from 'swr';

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

  // Mutate both current and past bookings (goes to past on check out)
  const mutateCurrentPast = () => mutate(
    key => typeof key === 'string' && (
      key.startsWith("/bookings/current") || key.startsWith("/bookings/past")
    )
  );

  const [isCheckingInOrOut, setIsCheckingInOrOut] = useState(false);
  const [checkInOrOutError, setCheckInOrOutError] = useState<string | null>(
    null
  );
  const [checkedIn, setCheckedIn] = useState<boolean>(
    booking.currentstatus === "checkedin"
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleCheckInOut = async () => {
    if (checkedIn) {
      // handle check out
      setIsCheckingInOrOut(true);
      setCheckInOrOutError(null);
      try {
        await checkOut(booking.id);
        setCheckedIn(false);
        await mutateCurrentPast();
      } catch (error) {
        if (error instanceof Error) {
          setCheckInOrOutError(error.message);
        } else {
          setCheckInOrOutError("An unexpected error occurred");
        }
        // TODO: handle error
      } finally {
        setIsCheckingInOrOut(false);
        setIsConfirmationOpen(false);
      }
      return;
    } else {
      // handle check in
      setIsCheckingInOrOut(true);
      setCheckInOrOutError(null);

      try {
        await checkIn(booking.id);
        setCheckedIn(true);
        await mutateCurrentPast();
      } catch (error) {
        if (error instanceof Error) {
          setCheckInOrOutError(error.message);
        } else {
          setCheckInOrOutError("An unexpected error occurred");
        }
        // TODO: handle error
      } finally {
        setIsCheckingInOrOut(false);
        setIsConfirmationOpen(false);
      }
    }
  };

  return (
    <>
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
                onClick={() => setIsConfirmationOpen(true)}
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
      </Card>
      <Modal
        open={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {checkedIn ? "Check Out Confirmation" : "Check In Confirmation "}
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to {checkedIn ? "check out" : "check in"}?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCheckInOut}
              color="success"
              loading={isCheckingInOrOut}
            >
              {checkedIn ? "Check Out" : "Check In"}
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setIsConfirmationOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default CurrentBookings;
