"use client";

import RoomCard from "@/app/components/roomCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import * as React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Option,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";

interface FilterOption {
  value: string;
  label: string;
}

const FilterControl = ({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: FilterOption[];
}) => (
  <FormControl size="sm">
    <FormLabel>{label}</FormLabel>
    <Select size="sm" placeholder={placeholder}>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </FormControl>
);

// TODO: replace with real data, this is just placeholder till an endpoint to pull data from is made
const rooms = [
  {
    id: "1",
    name: "K17 G02",
    type: "Consultation Room",
    capacity: 2,
    available: true,
  },
  {
    id: "2",
    name: "K17 302",
    type: "Meeting Room",
    capacity: 10,
    available: false,
  },
  {
    id: "3",
    name: "K17 301",
    type: "Meeting Room",
    capacity: 15,
    available: false,
  },
  {
    id: "4",
    name: "K17 G02",
    type: "Consultation Room",
    capacity: 2,
    available: false,
  },
  {
    id: "5",
    name: "K17 402A",
    type: "Consultation Room",
    capacity: 4,
    available: false,
  },
  {
    id: "6",
    name: "K17 601",
    type: "Meeting Room",
    capacity: 25,
    available: true,
  },
];

const renderFilters = () => (
  <React.Fragment>
    <FilterControl
      label="Type"
      placeholder="All"
      options={[
        { value: "all", label: "All" },
        { value: "meeting-room", label: "Meeting Room" },
        { value: "consult-room", label: "Consult Room" },
        { value: "conference-room", label: "Conference Room" },
      ]}
    />
    <FilterControl
      label="Capacity"
      placeholder="All"
      options={[
        { value: "all", label: "All" },
        { value: "1", label: "1+" },
        { value: "2", label: "2+" },
        { value: "3", label: "3+" },
        { value: "4", label: "4+" },
        { value: "5", label: "5+" },
        { value: "6", label: "6+" },
      ]}
    />
  </React.Fragment>
);

export default function Rooms() {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sort, setSort] = React.useState(false);
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0].toString()
  );
  const [startTime, setStartTime] = React.useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endTime, setEndTime] = React.useState(
    new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const toggleSort = () => {
    setSort(!sort);
  };

  const sortedRooms = [...rooms].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <h1>Rooms</h1>
      <Stack
        className="SearchAndFilters"
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
        borderRadius="sm"
      >
        {/* TODO: Make this actually search and apply the filter */}
        <FormControl sx={{ flex: 2 }} size="sm">
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        <Stack direction="row" gap={2} flexWrap="wrap">
          <Input
            type="date"
            defaultValue={date}
            onChange={(event) => {
              const d = new Date(event.target.value)
                .toISOString()
                .split("T")[0];
              setDate(d);
            }}
          />
          <Stack direction="row">
            <Input
              type="time"
              defaultValue={startTime}
              size="sm"
              onChange={(event) => {
                const d = new Date(event.target.value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                setStartTime(d);
              }}
            />
            <Input
              type="time"
              defaultValue={endTime}
              size="sm"
              onChange={(event) => {
                const d = new Date(event.target.value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                setEndTime(d);
              }}
            />
          </Stack>
          <Button
            startDecorator={<FilterListIcon />}
            variant="soft"
            color="neutral"
            size="sm"
            onClick={toggleFilters}
          >
            Filter
          </Button>
          {/* TODO: Make this actually apply sort, it does rn something but like some affordance is probably good */}
          <Button
            startDecorator={<SwapVertIcon />}
            variant="soft"
            color="neutral"
            size="sm"
            onClick={toggleSort}
          >
            Sort
          </Button>
        </Stack>
      </Stack>

      <Modal
        open={filtersOpen}
        onClose={toggleFilters}
        style={{ backdropFilter: "blur(1px)" }}
      >
        <ModalDialog
          aria-labelledby="filter-modal-title"
          aria-describedby="filter-modal-description"
          sx={{
            maxWidth: 400,
            borderRadius: "sm",
            p: 3,
          }}
        >
          <h2 id="modal-title">Filter Rooms</h2>
          {renderFilters()}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setFiltersOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={() => setFiltersOpen(false)}
            >
              {/* TODO: Make this actually apply the filter on submit */}
              Apply filters
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      <Stack
        direction="row"
        justifyContent="left"
        gap={3}
        flexWrap="wrap"
        alignItems="center"
        paddingTop="20px"
      >
        {(sort ? sortedRooms : sortedRooms.reverse()).map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </Stack>
    </>
  );
}
