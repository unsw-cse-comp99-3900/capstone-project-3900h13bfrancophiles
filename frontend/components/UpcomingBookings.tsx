"use client";
import * as React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Typography,
  CircularProgress,
} from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import useUpcomingBookings from "@/hooks/useUpcomingBookings";

import { NoBookingsRow } from "@/components/NoBookingsRow";
import { Booking } from "@/types";
import UpcomingBookingRow from "./UpcomingBookingRow";
export interface UpcomingBookingRowProps {
  row: Booking;
  mutate: () => void; // Pass mutate function as prop
}

export default function UpcomingBookings() {
  const [sort, setSort] = React.useState("soonest");
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

  const numColumns = 6;

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack>
      <Stack direction="row" width="100%" my={1} spacing={1}>
        <Box width="150px">
          Space
          <Select defaultValue="all" placeholder="All" onChange={handleChangeFilter}>
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
          display: { xs: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
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
              <th style={{ width: 50, padding: "12px 6px" }}>Reference No.</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Location</th>
              <th style={{ width: 150, padding: "12px 6px" }}>Description</th>
              <th style={{ width: 100, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {upcomingBookings?.length ? (
              upcomingBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => <UpcomingBookingRow key={row.id} row={row} mutate={mutate} />)
            ) : (
              <NoBookingsRow bookingType="Upcoming" colSpan={numColumns} isLoading={isLoading} />
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={numColumns}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} placeholder="5" value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows(
                      upcomingBookings ? page * rowsPerPage + 1 : 0,
                      getLabelDisplayedRowsTo(),
                      upcomingBookings?.length ?? 0,
                    )}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        page >= Math.ceil((upcomingBookings?.length ?? 0) / rowsPerPage) - 1
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </Stack>
  );
}
