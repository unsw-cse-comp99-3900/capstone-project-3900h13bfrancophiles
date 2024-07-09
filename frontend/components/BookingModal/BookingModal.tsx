"use client"

import React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import { Alert, IconButton, Sheet, Typography } from '@mui/joy';
import { addHours, format, min, roundToNearestMinutes, startOfDay, startOfTomorrow, } from 'date-fns';
import { Booking, SpaceOption } from '@/types';
import BookingForm from '@/components/BookingModal/BookingForm';
import BookingConfirmation from '@/components/BookingModal/BookingConfirmation';
import WarningIcon from '@mui/icons-material/Warning';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { createBooking } from '@/api';
import useUpcomingBookings from '@/hooks/useUpcomingBookings';

type ModalState = 'form' | 'confirm' | 'submitted';

export default function BookingModal() {
  // Modal control state
  const [open, setOpen] = React.useState<boolean>(false);
  const [state, setState] = React.useState<ModalState>('form');
  const [error, setError] = React.useState<string>();
  const [booking, setBooking] = React.useState<Booking>();
  const { mutate: mutateUpcomingBookings } = useUpcomingBookings();

  // Form state
  const [space, setSpace] = React.useState<SpaceOption | null>(null);
  const now = roundToNearestMinutes(new Date(), { nearestTo: 15, roundingMethod: "ceil" });
  const [date, setDate] = React.useState(startOfDay(now));
  const [start, setStart] = React.useState<Date>(now);
  const [end, setEnd] = React.useState<Date>(min([addHours(now, 1), startOfTomorrow()]));
  const [desc, setDesc] = React.useState<string>("");

  const onModalClose = () => {
    setOpen(false);
    setState('form');
    setError(undefined);
    setBooking(undefined);
  }

  const onSubmit = async () => {
    setError(undefined);
    try {
      if (!space || !start || !end) {
        setError("Required fields not filled");
        return
      }
      const res = await createBooking(space.id, start.toISOString(), end.toISOString(), desc);
      setBooking(res.booking);
      setState('submitted');
      await mutateUpcomingBookings();
    } catch (e: any) {
      setError(`${e}`);
      setState('form');
    }
  }

  const renderModalContent = () => {
    switch (state) {
      case 'form': return <>
        <DialogTitle>Create a new booking</DialogTitle>
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
        <Stack direction="row" justifyContent="space-between" spacing={6}>
          <BookingForm
            space={space}
            setSpace={setSpace}
            date={date}
            setDate={setDate}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            desc={desc}
            setDesc={setDesc}
            onSubmit={() => setState('confirm')}
          />
          <Stack direction="column" width={300} spacing={1}>
            <Typography level="body-md" textAlign="center" fontWeight={500}>
              {format(date, 'EEEE, MMMM d')}
            </Typography>
            <Sheet variant="outlined" sx={{ height: "100%", borderRadius: 10 }}>
              {/* TODO: put a calendar here */}
            </Sheet>
          </Stack>
        </Stack>
      </>
      case 'confirm': return space && start && end && (
        <BookingConfirmation
          spaceName={space.name}
          spaceId={space.id}
          date={date}
          start={start}
          end={end}
          desc={desc}
          isSubmitted={false}
          handleSubmit={onSubmit}
          handleBack={() => setState('form')}
          handleClose={onModalClose}
        />
      )
      case 'submitted': return space && start && end && booking && (
        <BookingConfirmation
          spaceName={space.name}
          spaceId={space.id}
          date={date}
          start={start}
          end={end}
          desc={desc}
          isSubmitted={true}
          bookingRef={booking.id}
          isPending={booking.currentstatus === 'pending'}
          handleSubmit={onSubmit}
          handleBack={() => setState('form')}
          handleClose={onModalClose}
        />
      )
    }
  }

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add/>}
        onClick={() => setOpen(true)}
      >
        Open Modal
      </Button>
      <Modal open={open} onClose={onModalClose}>
        <ModalDialog>
          {renderModalContent()}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

