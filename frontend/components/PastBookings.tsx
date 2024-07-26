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
import { Sheet, Stack } from "@mui/joy";
import usePastBookings from "@/hooks/usePastBookings";
import { NoBookingsRow } from "@/components/NoBookingsRow";
import PastBookingsRow from "@/components/PastBookingsRow";

export default function PastBookings() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState("all");

  const [sort, setSort] = React.useState("newest");
  const { pastBookings, total, isLoading } = usePastBookings(page + 1, rowsPerPage, filter, sort);

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

  const handleChangeSort = (event: any, newValue: string | null) => {
    if (newValue !== null) {
      setSort(newValue);
    }
  };

  const getLabelDisplayedRowsTo = () => {
    return Math.min(total ?? 0, (page + 1) * rowsPerPage);
  };

  const numColumns = 4;

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
          <Select defaultValue="newest" placeholder="Newest" onChange={handleChangeSort}>
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
          hoverRow={!!pastBookings?.length}
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
              <th style={{ width: 100, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Location</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {pastBookings?.length ? (
              pastBookings.map((row) => <PastBookingsRow key={row.id} row={row} />)
            ) : (
              <NoBookingsRow bookingType="Past" colSpan={numColumns} isLoading={isLoading} />
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
                      pastBookings ? page * rowsPerPage + 1 : 0,
                      getLabelDisplayedRowsTo(),
                      total ?? 0,
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
                      disabled={page >= Math.ceil((total ?? 0) / rowsPerPage) - 1}
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
