"use client";

import RoomCard from "@/components/RoomCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import * as React from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Option,
  Modal,
  ModalDialog,
  Stack,
  Slider,
  Alert,
} from "@mui/joy";
import useRoomDetails from "@/hooks/useRoomDetails";
import { Room } from "@/types";

interface FilterOption {
  value: string;
  label: string;
}

interface Filters {
  type: string;
  capacity: number;
}

interface FilterControlProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (
    event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: string | null
  ) => void;
}

interface CapacitySliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const renderFilters = (
  tempFilters: Filters,
  setTempFilters: React.Dispatch<React.SetStateAction<Filters>>
) => (
  <React.Fragment>
    <FilterControl
      label="Type"
      options={[
        { value: "all", label: "All" },
        { value: "meeting-room", label: "Meeting Room" },
        { value: "consultation-room", label: "Consultation Room" },
        { value: "conference-room", label: "Conference Room" },
      ]}
      value={tempFilters.type}
      onChange={(event, value) =>
        setTempFilters((prevFilters) => ({
          ...prevFilters,
          type: value as string,
        }))
      }
    />
    <CapacitySlider
      label="Capacity"
      min={1}
      max={25}
      value={tempFilters.capacity}
      onChange={(value) =>
        setTempFilters((prevFilters) => ({
          ...prevFilters,
          capacity: value,
        }))
      }
    />
  </React.Fragment>
);

const FilterControl: React.FC<FilterControlProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <FormControl size="sm">
    <FormLabel>{label}</FormLabel>
    <Select size="sm" value={value} onChange={onChange}>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </FormControl>
);

const CapacitySlider: React.FC<CapacitySliderProps> = ({
  label,
  min,
  max,
  value,
  onChange,
}) => (
  <FormControl size="sm">
    <FormLabel>{label}</FormLabel>
    <Slider
      min={min}
      max={max}
      value={value}
      onChange={(event, newValue) => onChange(newValue as number)}
      valueLabelDisplay="auto"
    />
  </FormControl>
);

export default function Rooms() {
  const [filtersOpen, setFiltersOpen] = React.useState<boolean>(false);
  const [sort, setSort] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [filters, setFilters] = React.useState<Filters>({
    type: "all",
    capacity: 1,
  });
  const [tempFilters, setTempFilters] = React.useState<Filters>({
    type: "all",
    capacity: 1,
  });
  const [date, setDate] = React.useState<string>(
    new Date().toISOString().split("T")[0].toString()
  );
  const [startTime, setStartTime] = React.useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endTime, setEndTime] = React.useState<string>(
    new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const { roomsData = [], isLoading, error } = useRoomDetails();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert color="danger">Error loading rooms</Alert>;

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const toggleSort = () => {
    setSort(!sort);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setFiltersOpen(false);
  };

  const filterRooms = (roomsData: Room[]) => {
    return roomsData.filter((room) => {
      const matchesType =
        filters.type === "all" ||
        room.type.toLowerCase().replace(" ", "-") === filters.type;
      const matchesCapacity = room.capacity >= filters.capacity;
      const matchesSearchQuery = room.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesCapacity && matchesSearchQuery;
    });
  };

  const sortedRooms = [...roomsData].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const displayedRooms = filterRooms(
    sort ? sortedRooms : sortedRooms.reverse()
  );

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
        <FormControl sx={{ flex: 2 }} size="sm">
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
            variant={
              sortedRooms.length === displayedRooms.length
                ? "outlined"
                : "solid"
            }
            color="neutral"
            size="sm"
            onClick={toggleFilters}
          >
            Filter
          </Button>
          <Button
            startDecorator={<SwapVertIcon />}
            variant={sort ? "solid" : "outlined"}
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
          {renderFilters(tempFilters, setTempFilters)}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setFiltersOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="outlined" color="primary" onClick={applyFilters}>
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
        {displayedRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </Stack>
    </>
  );
}
