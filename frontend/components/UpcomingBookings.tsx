"use client";
import * as React from "react";
import {
  Box,
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
  Sheet,
  Skeleton,
  Stack,
  Table,
  Typography,
  Link,
} from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import BookingStatusPill from "@/components/BookingStatusPill";
import useUpcomingBookings from "@/hooks/useUpcomingBookings";
import useSpace from "@/hooks/useSpace";
import { deleteBooking } from "@/api";
import BookingModal from "./BookingModal/BookingModal";
import NextLink from 'next/link'

import { NoBookingsRow } from '@/components/NoBookingsRow';
import { Booking } from '@/types';

export interface UpcomingBookingRowProps {
  row: Booking;
  mutate: () => void; // Pass mutate function as prop
}

function UpcomingBookingRow({ row, mutate }: UpcomingBookingRowProps) {
  const { space, type, isLoading } = useSpace(row.spaceid);
  const [bookingToDelete, setBookingToDelete] = React.useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const handleDelete = async () => {
    if (bookingToDelete !== null) {
      try {
        await deleteBooking(bookingToDelete);
        mutate(); // Refresh bookings after deletion
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
              href={type === 'room' ? `/rooms/${row.spaceid}` : `/desks/${row.spaceid}`}
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
            <IconButton
              variant="plain"
              color="neutral"
              onClick={() => handleOpenEditModal()}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              variant="plain"
              color="danger"
              onClick={() => handleOpenModal(row.id)}
            >
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
          <DialogContent>
            Are you sure you want to delete this booking?
          </DialogContent>
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
        space={space ? { id: space!.id, name: space!.name, isRoom: type === 'room' } : undefined}
        date={new Date(row.starttime)}
        start={new Date(row.starttime)}
        end={new Date(row.endtime)}
        desc={row.description}
        editing
        editedBooking={row.id}
        // I think reapproval stuff is handled by backend so don't need to pass status?
      />
    </>
  );
}

export default function UpcomingBookings() {
  const [sort, setSort] = React.useState('soonest');
  const [filter, setFilter] = React.useState("all");
  const { upcomingBookings, isLoading, mutate } = useUpcomingBookings(filter, sort); // Get mutate function from hook

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows(from: number, to: number, count: number) {
    return `${from}–${to} of ${count}`;
  }

  const handleChangeFilter = (event: any, newValue: string | null) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
  };

  const handleChangeSort = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue !== null) {
      setSort(newValue);
    }
  };

  const getLabelDisplayedRowsTo = () => {
    return Math.min(upcomingBookings?.length ?? 0, (page + 1) * rowsPerPage);
  };

  const numColumns = 5;

  return (<Stack>
      <Stack direction="row" width="100%" my={1} spacing={1}>
        <Box width="150px">
          Space
          <Select
            defaultValue="all"
            placeholder="All"
            onChange={handleChangeFilter}
          >
            <Option value="all">All</Option>
            <Option value="rooms">Rooms</Option>
            <Option value="desks">Desks</Option>
          </Select>
        </Box>
        <Box width="150px">
          Sort
          <Select defaultValue="soonest" placeholder="Soonest" onChange={handleChangeSort}>
            <Option value="soonest">Soonest</Option>
            <Option value="latest">Latest</Option>
          </Select>
        </Box>
      </Stack>
      <Sheet
        variant="outlined"
        sx={{
          display: {xs: "initial"}, width: "100%", borderRadius: "sm", flexShrink: 1, overflow: "auto", minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow={!!upcomingBookings?.length}
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
          <tr>
            <th style={{width: 100, padding: "12px 6px"}}>Status</th>
            <th style={{width: 140, padding: "12px 6px"}}>Time</th>
            <th style={{width: 140, padding: "12px 6px"}}>Location</th>
            <th style={{width: 150, padding: "12px 6px"}}>Description</th>
            <th style={{width: 100, padding: "12px 6px"}}></th>
          </tr>
          </thead>
          <tbody>
            {!!upcomingBookings?.length
              ? upcomingBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <UpcomingBookingRow key={row.id} row={row} mutate={mutate} />
                ))
              : <NoBookingsRow bookingType='Upcoming' colSpan={numColumns} isLoading={isLoading} />
            }
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={numColumns}>
              <Box
                sx={{
                  display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select
                    onChange={handleChangeRowsPerPage}
                    placeholder="5"
                    value={rowsPerPage}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography textAlign="center" sx={{minWidth: 80}}>
                  {labelDisplayedRows(
                    upcomingBookings ? page * rowsPerPage + 1 : 0,
                    getLabelDisplayedRowsTo(),
                    upcomingBookings?.length ?? 0,
                  )}
                </Typography>
                <Box sx={{display: "flex", gap: 1}}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{bgcolor: "background.surface"}}
                  >
                    <KeyboardArrowLeftIcon/>
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page >= Math.ceil((upcomingBookings?.length ?? 0) / rowsPerPage) - 1}
                    onClick={() => handleChangePage(page + 1)}
                    sx={{bgcolor: "background.surface"}}
                  >
                    <KeyboardArrowRightIcon/>
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
          </tfoot>
        </Table>
      </Sheet>
    </Stack>);
}
