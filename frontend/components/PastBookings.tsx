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

// import { authApiCall } from '@/api'
// import useSWR from 'swr'
import { Sheet, Stack } from "@mui/joy";
import { format } from 'date-fns';

export default function PastBookings() {
  function createData(
    id: number,
    startTime: Date,
    endTime: Date,
    space: string,
    isRoom: boolean,
    description: string
  ) {
    // Somehow concatenate space data to form space string
    return { id, startTime, endTime, space, isRoom, description };
  }

  const rows = [
    createData(
      1,
      new Date(2021, 4, 1, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 L2 Desk 13",
      false,
      "Thesis"
    ),
    createData(
      2,
      new Date(2022, 4, 2, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 L2 Desk 13",
      false,
      "Gaming"
    ),
    createData(
      3,
      new Date(2023, 4, 3, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 Meeting Room G02",
      true,
      "Society event"
    ),
    createData(
      4,
      new Date(2024, 4, 4, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 L2 Desk 13",
      false,
      "Working"
    ),
    createData(
      5,
      new Date(2025, 4, 5, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 Meeting Room G02",
      true,
      "Assignment"
    ),
    createData(
      6,
      new Date(2026, 4, 6, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 Meeting Room G02",
      true,
      "Filming a video"
    ),
    createData(
      7,
      new Date(2027, 4, 7, 17, 23, 42, 11),
      new Date(2021, 4, 1, 18, 23, 42, 11),
      "K17 Meeting Room G02",
      true,
      "Class"
    ),
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState("all");
  const [filteredRows, setFilteredRows] = React.useState(
    rows.sort((a, b) => (a.startTime < b.startTime ? 1 : -1))
  );
  const [sortNewest, setSortNewest] = React.useState(true);

  // // will eventually get data from backend
  // const getData = () => {
  //   authApiCall(
  //     "/bookings/past",
  //     'GET',
  //     {
  //       page: 0,
  //       limit: 5,
  //     }
  //   ).then(e => console.log(e))
  // }

  // const getData2 = () => {
  //   const { data, error, isLoading } = useSWR('/api/user', fetch)
  // }

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
    setSortNewest(newValue === "newest");
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
  }, [filter, sortNewest]);

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
          <Select defaultValue="newest" onChange={handleChangeSort}>
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
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
              <th style={{ width: 140, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Location</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <tr key={row.id}>
                  <td>
                    <Typography level="body-sm">
                      {format(row.startTime, "dd/MM/yy k:mm")} - {format(row.endTime, "k:mm")}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">{row.space}</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">{row.description}</Typography>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
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
