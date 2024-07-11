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

export interface UpcomingBookingRowProps {
  row: Row;
  mutate: () => void; // Pass mutate function as prop
}

interface Row {
  id: number;
  status: string;
  startTime: Date;
  endTime: Date;
  space: string;
  description: string;
}


function UpcomingBookingRow({ row, mutate }: UpcomingBookingRowProps) {
  const { space, isLoading } = useSpace(row.space);
  const [bookingToDelete, setBookingToDelete] = React.useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);

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

  return (
    <>
      <tr>
        <td>
          <BookingStatusPill status={row.status} />
        </td>
        <td>
          <Typography level="body-sm">
            {format(row.startTime, "dd/MM/yy k:mm")} -{" "}
            {format(row.endTime, "k:mm")}
          </Typography>
        </td>
        <td>
          <Link
            href={`/space/${row.space}`}
            level="body-sm"
          >
            <Skeleton loading={isLoading}>
              {space?.name}
            </Skeleton>
          </Link>
        </td>
        <td>
          <Typography level="body-sm">{row.description}</Typography>
        </td>
        <td>
          <Stack direction="row" justifyContent="flex-end" px={1}>
            <IconButton variant="plain" color="neutral">
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
    </>
  );
}

export default function UpcomingBookings() {
  const [sort, setSort] = React.useState('soonest');
  const [filter, setFilter] = React.useState("all");
  const { upcomingBookings, isLoading, mutate } = useUpcomingBookings(filter, sort); // Get mutate function from hook
  const [rows, setRows] = React.useState<Row[]>([]);

  React.useEffect(() => {
    if (!isLoading && upcomingBookings) {
      const rowsData = upcomingBookings.map((booking) => ({
        id: booking.id,
        status: booking.currentstatus,
        startTime: new Date(booking.starttime),
        endTime: new Date(booking.endtime),
        space: booking.spaceid,
        description: booking.description,
      }));
      setRows(rowsData);
    }
  }, [upcomingBookings, isLoading]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows({
                                from, to, count,
                              }: {
    from: number; to: number; count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
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
    return rowsPerPage === -1 ? rows.length : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  return (<Stack>
      <Stack direction="row" width="100%" my={1} spacing={1}>
        <Box width="200px">
          Space
          <Select
            defaultValue="all"
            placeholder="Filter by space"
            onChange={handleChangeFilter}
          >
            <Option value="all">All</Option>
            <Option value="rooms">Rooms</Option>
            <Option value="desks">Desks</Option>
          </Select>
        </Box>
        <Box width="200px">
          Time
          <Select defaultValue="soonest" onChange={handleChangeSort}>
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
          hoverRow
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <UpcomingBookingRow key={row.id} row={row} mutate={mutate} />
              ))}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={5}>
              <Box
                sx={{
                  display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select
                    onChange={handleChangeRowsPerPage}
                    value={rowsPerPage}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography textAlign="center" sx={{minWidth: 80}}>
                  {labelDisplayedRows({
                    from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: rows.length === -1 ? -1 : rows.length,
                  })}
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
                    disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
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
