import DialogTitle from '@mui/joy/DialogTitle';
import { DialogActions, DialogContent, Divider } from '@mui/joy';
import { format } from 'date-fns';
import Button from '@mui/joy/Button';
import React from 'react';

interface BookingConfirmationProps {
  spaceName: string,
  spaceId: string,
  date: Date,
  start: Date,
  end: Date,
  desc: string,
  isSubmitted: boolean,
  bookingRef?: number,
  isPending?: boolean,
  handleSubmit: () => void,
  handleBack: () => void,
  handleClose: () => void,
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  spaceName,
  spaceId,
  date,
  start,
  end,
  desc,
  isSubmitted,
  bookingRef,
  isPending,
  handleSubmit,
  handleBack,
  handleClose,
}) => {
  return <>
    <DialogTitle>{isSubmitted
      ? `Booking ${isPending ? 'request ' : ''}submitted!`
      : "Confirm booking details"
    }</DialogTitle>
    {isPending &&
      <DialogContent>
        You will be notified when an admin responds to your request.
      </DialogContent>
    }
    <Divider/>
    {bookingRef &&
      <DialogContent>
        <b>Reference Number:</b> #{bookingRef}
      </DialogContent>
    }
    <DialogContent>
      <b>Space:</b> {spaceName} ({spaceId})
    </DialogContent>
    <DialogContent>
      <b>Time:</b> {format(date, 'EEEE, MMMM d')}, {start && format(start, 'p')} - {end && format(end, 'p')}
    </DialogContent>
    <DialogContent>
      <b>Description:</b> {!!desc ? desc : 'N/A'}
    </DialogContent>
    <DialogActions>
      {isSubmitted
        ? <Button variant="soft" color="neutral" onClick={handleClose}>
          Close
        </Button>
        : <>
          <Button variant="solid" color="primary" onClick={handleSubmit}>
            Confirm
          </Button>
          <Button variant="plain" color="neutral" onClick={handleBack}>
            Back
          </Button>
        </>
      }
    </DialogActions>
  </>;
}

export default BookingConfirmation;
