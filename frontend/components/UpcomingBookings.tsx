"use client";
import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {Sheet, Skeleton, Stack} from "@mui/joy";
import BookingStatusPill from "@/components/BookingStatusPill";
import { format } from 'date-fns';
import useUpcomingBookings from "@/hooks/useUpcomingBookings";
import useSpace from "@/hooks/useSpace";

export interface UpcomingBookingRowProps {
  row: {
    id: number,
    status: string,
    startTime: Date,
    endTime: Date,
    space: string,
    isRoom: boolean,
    description: string
  }
}
function UpcomingBookingRow({row}: UpcomingBookingRowProps) {
  const { space, isLoading } = useSpace(row.space);

  return <tr>
    <td>
      <BookingStatusPill status={row.status}/>
    </td>
    <td>
      <Typography level="body-sm">
        {format(row.startTime, "dd/MM/yy k:mm")} - {format(row.endTime, "k:mm")}
      </Typography>
    </td>
    <td>
      <Skeleton loading={isLoading}>
        <Typography level="body-sm">{space?.name}</Typography>
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
        >
          <EditIcon/>
        </IconButton>
        <IconButton
          variant="plain"
          color="danger"
        >
          <DeleteIcon/>
        </IconButton>
      </Stack>
    </td>
  </tr>;
}

export default function UpcomingBookings() {
  const { upcomingBookings, isLoading } = useUpcomingBookings();
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    if (!isLoading && upcomingBookings) {
      const rowsData = upcomingBookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        startTime: new Date(booking.starttime),
        endTime: new Date(booking.endtime),
        space: booking.spaceid,
        description: booking.description,
      }));
      setRows(rowsData);
    }
  }, [upcomingBookings, isLoading]);

  function createData(
    id: number,
    status: string,
    startTime: Date,
    endTime: Date,
    space: string,
    description: string
  ) {
    return { id, status, startTime, endTime, space, description };
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState("all");
  const [filteredRows, setFilteredRows] = React.useState(
    rows.sort((a, b) => (a.startTime < b.startTime ? 1 : -1))
  );
  const [sortNewest, setSortNewest] = React.useState(true);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  }

  const handleChangeFilter = (event: any) => {
    const value = event.target.value;
    setFilter(value);
  };

  const handleChangeSort = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setSortNewest(newValue === "soonest");
  };

  React.useEffect(() => {
    setFilteredRows(
      rows
        .filter(() => true) // now filtering in the backend
        .sort((a, b) =>
          a.startTime < b.startTime
            ? sortNewest
              ? 1
              : -1
            : sortNewest
            ? -1
            : 1
        )
    ); // this will also be backend
  }, [rows, filter, sortNewest]);

  const getLabelDisplayedRowsTo = () => {
    if (filteredRows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? filteredRows.length
      : Math.min(filteredRows.length, (page + 1) * rowsPerPage);
  };

  return (
    <Stack>
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
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 100, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Location</th>
              <th style={{ width: 150, padding: "12px 6px" }}>Description</th>
              <th style={{ width: 100, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <UpcomingBookingRow key={row.id} row={row}/>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
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
                    <Select
                      onChange={handleChangeRowsPerPage}
                      value={rowsPerPage}
                    >
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows({
                      from:
                        filteredRows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count:
                        filteredRows.length === -1 ? -1 : filteredRows.length,
                    })}
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
                        filteredRows.length !== -1
                          ? page >=
                            Math.ceil(filteredRows.length / rowsPerPage) - 1
                          : false
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
