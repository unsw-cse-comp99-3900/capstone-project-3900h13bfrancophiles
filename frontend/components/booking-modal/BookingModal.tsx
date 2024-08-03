"use client";

import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { Alert, Box, IconButton, ModalOverflow, Typography } from "@mui/joy";
import { format } from "date-fns";
import { Booking, TimeRange } from "@/types";
import BookingForm from "@/components/booking-modal/BookingForm";
import BookingConfirmation from "@/components/booking-modal/BookingConfirmation";
import ModalCalendar from "./ModalCalendar";
import WarningIcon from "@mui/icons-material/Warning";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { createBooking, editBooking } from "@/api";
import useTimeRange from "@/hooks/useTimeRange";

type ModalState = "form" | "confirm" | "submitted";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  space?: string;
  date?: Date;
  start?: Date;
  end?: Date;
  desc?: string;
  editedBookingId?: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  space: initialSpace,
  date: initialDate,
  start: initialStart,
  end: initialEnd,
  desc: initialDesc,
  editedBookingId,
}) => {
  // Modal control state
  const [state, setState] = React.useState<ModalState>("form");
  const [error, setError] = React.useState<string>();
  const [booking, setBooking] = React.useState<Booking>();
  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [space, setSpace] = React.useState<string | undefined>(initialSpace);
  React.useEffect(() => {
    setSpace(initialSpace!);
  }, [initialSpace]);

  const [blockedTimes, setBlockedTimes] = React.useState<TimeRange[]>([]);
  React.useEffect(() => {
    setBlockedTimes([]);
  }, [space]);

  const {
    date,
    start,
    end,
    dateInputProps,
    startTimePickerProps,
    endTimePickerProps,
    startError,
    endError,
  } = useTimeRange({ date: initialDate, start: initialStart, end: initialEnd, blockedTimes });
  const [desc, setDesc] = React.useState<string>(initialDesc ?? "");

  const onModalClose = () => {
    onClose();
    setState("form");
    setError(undefined);
    setBooking(undefined);
  };

  const onSubmit = async () => {
    setError(undefined);
    try {
      if (!space) {
        setError("Please select a space");
        setState("form");
        return;
      }
      setIsLoading(true);
      const res = editedBookingId
        ? await editBooking(editedBookingId, start.toISOString(), end.toISOString(), space, desc)
        : await createBooking(space, start.toISOString(), end.toISOString(), desc);
      setIsLoading(false);
      setBooking(res.booking);
      setState("submitted");
    } catch (e: unknown) {
      setError(`${e}`);
      setState("form");
    }
  };

  const renderModalContent = () => {
    switch (state) {
      case "form":
        return (
          <>
            <DialogTitle>{editedBookingId ? "Edit booking " : "Create a new booking"}</DialogTitle>
            {error && (
              <Alert
                size="md"
                color="danger"
                variant="soft"
                startDecorator={<WarningIcon />}
                endDecorator={
                  <IconButton variant="soft" color="danger" onClick={() => setError(undefined)}>
                    <CloseRoundedIcon />
                  </IconButton>
                }
              >
                <b>{error}</b>
              </Alert>
            )}
            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              spacing={{ xs: 3, sm: 6 }}
            >
              <BookingForm
                space={space}
                setSpace={setSpace}
                dateInputProps={dateInputProps}
                startTimePickerProps={startTimePickerProps}
                endTimePickerProps={endTimePickerProps}
                desc={desc}
                setDesc={setDesc}
                onSubmit={() => setState("confirm")}
                disableSubmit={startError || endError}
              />
              <Stack direction="column" width={{ xs: 250, sm: 300 }} spacing={1}>
                <Typography level="body-md" textAlign="center" fontWeight={500}>
                  {format(date, "EEEE, MMMM d")}
                </Typography>
                {space ? (
                  <ModalCalendar
                    space={space}
                    date={date}
                    start={start}
                    end={end}
                    editedBookingId={editedBookingId}
                    setBlockedTimes={setBlockedTimes}
                  />
                ) : (
                  <Box alignSelf={"center"}>Select a space you would like to book!</Box>
                )}
              </Stack>
            </Stack>
          </>
        );
      case "confirm":
        return (
          space && (
            <BookingConfirmation
              spaceId={space}
              date={date}
              start={start}
              end={end}
              desc={desc}
              isSubmitted={false}
              handleSubmit={onSubmit}
              handleBack={() => setState("form")}
              handleClose={onModalClose}
              isLoading={isLoading}
            />
          )
        );
      case "submitted":
        return (
          space &&
          booking && (
            <BookingConfirmation
              spaceId={space}
              date={date}
              start={start}
              end={end}
              desc={desc}
              isSubmitted={true}
              bookingRef={booking.id}
              isPending={booking.currentstatus === "pending"}
              editing={!!editedBookingId}
              handleSubmit={onSubmit}
              handleBack={() => setState("form")}
              handleClose={onModalClose}
            />
          )
        );
    }
  };

  return (
    <Modal open={open} onClose={onModalClose}>
      <ModalOverflow>
        <ModalDialog>{renderModalContent()}</ModalDialog>
      </ModalOverflow>
    </Modal>
  );
};

export default BookingModal;
