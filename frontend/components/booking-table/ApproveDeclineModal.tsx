"use client";
import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";

import { Booking } from "@/types";
import { approveBooking, declineBooking } from "@/api";
import useOverlappingBookings from "@/hooks/useOverlappingBookings";
import BookingTable from "@/components/booking-table/BookingTable";

interface ApproveDeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  approving: boolean;
  booking: Booking;
  setError: (error: string | undefined) => void;
}

const ApproveDeclineModal: React.FC<ApproveDeclineModalProps> = ({
  isOpen,
  onClose,
  approving,
  booking,
  setError,
}) => {
  const [isApprovingOrDeclining, setIsApprovingOrDeclining] = React.useState(false);
  const { overlappingBookings, isLoading } = useOverlappingBookings(booking.id);
  const countOverlapping = overlappingBookings ? overlappingBookings.length : 0;

  const handleApproveDecline = async () => {
    setIsApprovingOrDeclining(true);
    try {
      if (approving) {
        await approveBooking(booking.id);
      } else {
        await declineBooking(booking.id);
      }
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsApprovingOrDeclining(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          {approving
            ? "Booking Request Approval Confirmation"
            : "Booking Request Decline Confirmation"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {approving ? (
            <Stack gap={3}>
              <Typography>Are you sure you want to approve this booking request?</Typography>
              {countOverlapping > 0 && overlappingBookings && (
                <Stack gap={1}>
                  <Typography>
                    Approving this booking will automatically decline the following overlapping
                    bookings:
                  </Typography>
                  <BookingTable
                    columns={[
                      { heading: "Reference No.", width: 120 },
                      { heading: "Time", width: 200 },
                      { heading: "User", width: 200 },
                      { heading: "Description", width: 200 },
                    ]}
                    data={overlappingBookings}
                    isLoading={isLoading}
                    noPagination
                  />
                </Stack>
              )}
            </Stack>
          ) : (
            <Typography>Are you sure you want to decline this booking request?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleApproveDecline}
            color={approving ? "success" : "danger"}
            loading={isApprovingOrDeclining}
          >
            {approving ? "Approve" : "Decline"}
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ApproveDeclineModal;
