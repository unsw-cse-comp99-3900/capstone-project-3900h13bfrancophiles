"use client"

import React from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import { Alert, IconButton, Sheet, Typography } from '@mui/joy';
import { format } from 'date-fns';
import { Booking, SpaceOption } from '@/types';
import BookingForm from '@/components/BookingModal/BookingForm';
import BookingConfirmation from '@/components/BookingModal/BookingConfirmation';
import WarningIcon from '@mui/icons-material/Warning';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { createBooking, editBooking } from '@/api';
import useTimeRange from '@/hooks/useTimeRange';

type ModalState = 'form' | 'confirm' | 'submitted';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  space?: SpaceOption;
  date?: Date;
  start?: Date;
  end?: Date;
  desc?: string;
  editing?: boolean;
  editedBooking?: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  space: initialSpace,
  date: initialDate,
  start: initialStart,
  end: initialEnd,
  desc: initialDesc,
  editing,
  editedBooking,
}) => {
  // Modal control state
  const [state, setState] = React.useState<ModalState>('form');
  const [error, setError] = React.useState<string>();
  const [booking, setBooking] = React.useState<Booking>();

  // Form state
  const [space, setSpace] = React.useState<SpaceOption | null>(initialSpace ?? null);
  React.useEffect(() => {
    setSpace(initialSpace!)
  }, [initialSpace])

  const {
    date, start, end,
    dateInputProps, startTimePickerProps, endTimePickerProps
  } = useTimeRange({ date: initialDate, start: initialStart, end: initialEnd });
  const [desc, setDesc] = React.useState<string>(initialDesc ?? "");

  const onModalClose = () => {
    onClose();
    setState('form');
    setError(undefined);
    setBooking(undefined);
  }

  const onSubmit = async () => {
    setError(undefined);
    try {
      if (!space) {
        setError("Please select a space");
        setState('form');
        return
      }
      const res = editing ?
        await editBooking(editedBooking!, start.toISOString(), end.toISOString(), space.id, desc)
        : await createBooking(space.id, start.toISOString(), end.toISOString(), desc);
      setBooking(res.booking);
      setState('submitted');
    } catch (e: any) {
      setError(`${e}`);
      setState('form');
    }
  }

  const renderModalContent = () => {
    switch (state) {
      case 'form':
        return <>
          <DialogTitle>{editing ? "Edit booking ": "Create a new booking"}</DialogTitle>
          {error && (
            <Alert
              size="md"
              color="danger"
              variant="soft"
              startDecorator={<WarningIcon/>}
              endDecorator={
                <IconButton variant="soft" color="danger" onClick={() => setError(undefined)}>
                  <CloseRoundedIcon/>
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
              dateInputProps={dateInputProps}
              startTimePickerProps={startTimePickerProps}
              endTimePickerProps={endTimePickerProps}
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
      case 'confirm':
        return space && (
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
      case 'submitted':
        return space && booking && (
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
            editing={editing}
            handleSubmit={onSubmit}
            handleBack={() => setState('form')}
            handleClose={onModalClose}
          />
        )
    }
  }

  return (
    <Modal open={open} onClose={onModalClose}>
      <ModalDialog>
        {renderModalContent()}
      </ModalDialog>
    </Modal>
  );
}

export default BookingModal;
