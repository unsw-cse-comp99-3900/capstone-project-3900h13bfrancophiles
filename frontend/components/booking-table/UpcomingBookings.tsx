"use client";

import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useUpcomingBookings from "@/hooks/useUpcomingBookings";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { deleteBooking } from "@/api";
import BookingTable, { BookingTableColumn } from "@/components/booking-table/BookingTable";
import ErrorSnackbar from "@/components/feedback/ErrorSnackbar";
import BookingModal from "@/components/booking-modal/BookingModal";
import { Booking } from "@/types";

export default function UpcomingBookings() {
  // Table state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sort, setSort] = React.useState("soonest");
  const [filter, setFilter] = React.useState("all");
  const { upcomingBookings, isLoading, mutate } = useUpcomingBookings(filter, sort);

  // Deletion confirmation modal state
  const [bookingToDelete, setBookingToDelete] = React.useState<number>();
  const [deleteBookingError, setDeleteBookingError] = React.useState<string>();

  const handleDelete = async () => {
    if (bookingToDelete) {
      setDeleteBookingError(undefined);
      try {
        await deleteBooking(bookingToDelete);
        await mutate();
        setBookingToDelete(undefined);
      } catch (err) {
        setDeleteBookingError("An unexpected error occurred");
      }
    }
  };

  // Edit booking modal state
  const [bookingToEdit, setBookingToEdit] = React.useState<Booking>();

  const handleCloseEditModal = async () => {
    setBookingToEdit(undefined);
    await mutate();
  };

  const columns: BookingTableColumn[] = [
    { heading: "Reference No.", width: 120 },
    { heading: "Status", width: 100 },
    { heading: "Time", width: 200 },
    { heading: "Location", width: 150 },
    { heading: "Description", width: 200 },
    {
      heading: "",
      width: 80,
      render: (booking: Booking) => (
        <Stack direction="row" justifyContent="flex-end" px={1}>
          <IconButton variant="plain" color="neutral" onClick={() => setBookingToEdit(booking)}>
            <EditIcon />
          </IconButton>
          <IconButton variant="plain" color="danger" onClick={() => setBookingToDelete(booking.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack>
        <Stack direction="row" width="100%" my={1} spacing={1}>
          <FormControl sx={{ width: 150 }}>
            <FormLabel>Space</FormLabel>
            <Select
              value={filter}
              placeholder="All"
              onChange={(_e, val) => {
                if (val) {
                  setFilter(val);
                  setPage(0);
                }
              }}
            >
              <Option value="all">All</Option>
              <Option value="rooms">Rooms</Option>
              <Option value="desks">Desks</Option>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }}>
            <FormLabel>Sort</FormLabel>
            <Select
              value={sort}
              placeholder="Soonest"
              onChange={(_e, val) => {
                if (val) {
                  setSort(val);
                  setPage(0);
                }
              }}
            >
              <Option value="soonest">Soonest</Option>
              <Option value="latest">Latest</Option>
            </Select>
          </FormControl>
        </Stack>
        <BookingTable
          columns={columns}
          data={upcomingBookings?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
          total={upcomingBookings?.length}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          onChange={(newPage, newRowsPerPage) => {
            setPage(newPage);
            setRowsPerPage(newRowsPerPage);
          }}
        />
      </Stack>
      <Modal open={!!bookingToDelete} onClose={() => setBookingToDelete(undefined)}>
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
            <Button variant="plain" color="neutral" onClick={() => setBookingToDelete(undefined)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <ErrorSnackbar
        errorMessage={deleteBookingError ?? ""}
        open={!!deleteBookingError}
        onClose={() => setDeleteBookingError(undefined)}
      />
      {bookingToEdit && (
        <BookingModal
          open={!!bookingToEdit}
          onClose={handleCloseEditModal}
          space={bookingToEdit?.spaceid}
          date={new Date(bookingToEdit.starttime)}
          start={new Date(bookingToEdit.starttime)}
          end={new Date(bookingToEdit.endtime)}
          desc={bookingToEdit.description}
          editing
          editedBooking={bookingToEdit.id}
        />
      )}
    </>
  );
}
