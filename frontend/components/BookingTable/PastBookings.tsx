"use client";

import * as React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";

import BookingTable from "@/components/BookingTable/BookingTable";
import usePastBookings from "@/hooks/usePastBookings";

export default function PastBookings() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const { pastBookings, total, isLoading } = usePastBookings(page + 1, rowsPerPage, filter, sort);

  return (
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
            placeholder="Newest"
            onChange={(_e, val) => {
              if (val) {
                setSort(val);
                setPage(0);
              }
            }}
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
          </Select>
        </FormControl>
      </Stack>
      <BookingTable
        columns={[
          { heading: "Reference No.", width: 120 },
          { heading: "Time", width: 150 },
          { heading: "Location", width: 150 },
          { heading: "Description", width: 200 },
        ]}
        data={pastBookings}
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
  );
}
