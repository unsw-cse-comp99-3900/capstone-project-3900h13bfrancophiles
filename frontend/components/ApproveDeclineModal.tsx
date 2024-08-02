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
import usePendingBookings from "@/hooks/usePendingBookings";
import BookingTable from "@/components/BookingTable/BookingTable";

interface ApproveDeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  approving: boolean;
  row: Booking;
  page: number;
  rowsPerPage: number;
  sort: string;
  setApproveDeclineError: (error: string | null) => void;
}

const ApproveDeclineModal: React.FC<ApproveDeclineModalProps> = ({
  isOpen,
  onClose,
  approving,
  row,
  page,
  rowsPerPage,
  sort,
  setApproveDeclineError,
}) => {
  const [isApprovingOrDeclining, setIsApprovingOrDeclining] = React.useState(false);

  const {
    overlappingBookings,
    isLoading,
    mutate: mutateOverlappingBookings,
  } = useOverlappingBookings(row.id);
  const countOverlapping = overlappingBookings ? overlappingBookings.length : 0;
  const { mutate: mutatePendingBookings } = usePendingBookings(page + 1, rowsPerPage, sort);

  const handleApproveDecline = async () => {
    setIsApprovingOrDeclining(true);
    try {
      if (approving) {
        await approveBooking(row.id);
      } else {
        await declineBooking(row.id);
      }
      await mutatePendingBookings();
      await mutateOverlappingBookings();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setApproveDeclineError(error.message);
      } else {
        setApproveDeclineError("An unexpected error occurred");
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
                      { heading: "Time", width: 150 },
                      { heading: "User", width: 200 },
                      { heading: "Description", width: 200 },
                    ]}
                    data={overlappingBookings}
                    total={overlappingBookings.length}
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
