"use client";

import * as React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import usePendingBookings from "@/hooks/usePendingBookings";
import BookingTable, { BookingTableColumn } from "@/components/booking-table/BookingTable";
import ApproveDeclineModal from "./ApproveDeclineModal";
import ErrorSnackbar from "@/components/feedback/ErrorSnackbar";
import { Booking } from "@/types";

export default function PendingBookings() {
  // Table state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sort, setSort] = React.useState("soonest");
  const { pendingBookings, total, isLoading, mutate } = usePendingBookings(
    page + 1,
    rowsPerPage,
    sort,
  );

  // Action state
  const [bookingToAction, setBookingToAction] = React.useState<Booking>();
  const [action, setAction] = React.useState<"approving" | "declining">();
  const [approveDeclineError, setApproveDeclineError] = React.useState<string>();

  const columns: BookingTableColumn[] = [
    { heading: "Reference No.", width: 120 },
    { heading: "Time", width: 150 },
    { heading: "Location", width: 150 },
    { heading: "User", width: 200 },
    { heading: "Description", width: 200 },
    {
      heading: "",
      width: 80,
      render: (booking) => (
        <Stack direction="row" justifyContent="flex-end" px={1}>
          <IconButton
            variant="plain"
            color="success"
            onClick={() => {
              setBookingToAction(booking);
              setAction("approving");
            }}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            variant="plain"
            color="danger"
            onClick={() => {
              setBookingToAction(booking);
              setAction("declining");
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack>
        <FormControl sx={{ width: 150, my: 1 }}>
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
        <BookingTable
          name="Pending"
          columns={columns}
          data={pendingBookings}
          total={total}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          onChange={(newPage, newRowsPerPage) => {
            setPage(newPage);
            setRowsPerPage(newRowsPerPage);
          }}
        />
      </Stack>
      {bookingToAction && (
        <ApproveDeclineModal
          isOpen={!!action}
          onClose={async () => {
            setBookingToAction(undefined);
            setAction(undefined);
            await mutate();
          }}
          approving={action === "approving"}
          booking={bookingToAction}
          setError={setApproveDeclineError}
        />
      )}
      <ErrorSnackbar
        errorMessage={approveDeclineError ?? ""}
        open={!!approveDeclineError}
        onClose={() => setApproveDeclineError(undefined)}
      />
    </>
  );
}
