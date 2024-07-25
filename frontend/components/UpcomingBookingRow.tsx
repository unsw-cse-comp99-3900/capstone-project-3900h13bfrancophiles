import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
  ModalDialog,
  Skeleton,
  Stack,
  Typography,
  Link,
} from "@mui/joy";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import BookingStatusPill from "@/components/BookingStatusPill";
import useSpace from "@/hooks/useSpace";
import { deleteBooking } from "@/api";
import BookingModal from "./BookingModal/BookingModal";
import NextLink from "next/link";
import { Booking } from "@/types";

export interface UpcomingBookingRowProps {
  row: Booking;
  mutate: () => void;
}

export default function UpcomingBookingRow({ row, mutate }: UpcomingBookingRowProps) {
  const { space, type, isLoading } = useSpace(row.spaceid);
  const [bookingToDelete, setBookingToDelete] = React.useState<number | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const handleDelete = async () => {
    if (bookingToDelete !== null) {
      try {
        await deleteBooking(bookingToDelete);
        mutate();
        handleCloseModal();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenModal = (id: number) => {
    setBookingToDelete(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setBookingToDelete(null);
    setModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    mutate();
  };

  return (
    <>
      <tr>
        <td>
          <Typography level="body-sm">#{row.id}</Typography>
        </td>
        <td>
          <BookingStatusPill status={row.currentstatus} />
        </td>
        <td>
          <Typography level="body-sm">
            {format(new Date(row.starttime), "dd/MM/yy H:mm")} -{" "}
            {format(new Date(row.endtime), "H:mm")}
          </Typography>
        </td>
        <td>
          <Skeleton loading={isLoading}>
            <Link
              href={type === "room" ? `/rooms/${row.spaceid}` : `/desks/${row.spaceid}`}
              level="body-sm"
              component={NextLink}
            >
              {space?.name}
            </Link>
          </Skeleton>
        </td>
        <td>
          <Typography level="body-sm">{row.description}</Typography>
        </td>
        <td>
          <Stack direction="row" justifyContent="flex-end" px={1}>
            <IconButton variant="plain" color="neutral" onClick={() => handleOpenEditModal()}>
              <EditIcon />
            </IconButton>
            <IconButton variant="plain" color="danger" onClick={() => handleOpenModal(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </td>
      </tr>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>Are you sure you want to delete this booking?</DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleDelete}>
              Delete Booking
            </Button>
            <Button variant="plain" color="neutral" onClick={handleCloseModal}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <BookingModal
        open={editModalOpen}
        onClose={() => handleCloseEditModal()}
        space={space ? { id: space!.id, name: space!.name, isRoom: type === "room" } : undefined}
        date={new Date(row.starttime)}
        start={new Date(row.starttime)}
        end={new Date(row.endtime)}
        desc={row.description}
        editing
        editedBooking={row.id}
      />
    </>
  );
}
