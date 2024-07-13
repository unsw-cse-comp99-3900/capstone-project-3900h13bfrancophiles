"use client";

import RoomCard from "@/components/RoomCard";
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
  Slider,
  Typography,
} from "@mui/joy";
import useRoomDetails from "@/hooks/useRoomDetails";
import { Room } from "@/types";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import useTimeRange from '@/hooks/useTimeRange';
import BookingModal from '@/components/BookingModal/BookingModal';

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
  const {
    date, start, end,
    dateInputProps, startInputProps, endInputProps
  } = useTimeRange();
  const [selectedRoom, setSelectedRoom] = React.useState<Room>();

  const { roomsData = [], isLoading, error } = useRoomDetails();
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false);

  if (isLoading) return <Loading page="Rooms" />;
  if (error) return <Error page="Rooms" message="Error loading rooms"/>;

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const toggleSort = () => {
    setSort(!sort);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    if (
      tempFilters.type !== "all" ||
      tempFilters.capacity !== 1
    ) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
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
      {!!selectedRoom && <BookingModal
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(undefined)}
        space={selectedRoom ? { id: selectedRoom.id, name: selectedRoom.name, isRoom: true } : undefined}
        date={date}
        start={start}
        end={end}
      />}
      <Typography level="h1" mb={0}>Rooms</Typography>
      <Stack
        className="SearchAndFilters"
        alignItems="flex-end"
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
        <Stack direction="row" gap={2} flexWrap="wrap" alignItems="flex-end" >
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input size="sm" {...dateInputProps} />
          </FormControl>
          <Stack direction="row">
            <FormControl>
              <FormLabel>Start</FormLabel>
              <Input
                size="sm"
                sx={{ borderBottomRightRadius: 0, borderTopRightRadius: 0, width: 115 }}
                {...startInputProps}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End</FormLabel>
              <Input
                size="sm"
                sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0, borderLeft: 'none', width: 115 }}
                {...endInputProps}
              />
            </FormControl>
          </Stack>
          <FormControl>
            <Button
              startDecorator={<FilterListIcon />}
              variant={isFiltered ? "solid" : "outlined"}
              color="neutral"
              size="sm"
              onClick={toggleFilters}
            >
              Filter
            </Button>
          </FormControl>
          <FormControl>
            <Button
              startDecorator={<SwapVertIcon />}
              variant={sort ? "solid" : "outlined"}
              color="neutral"
              size="sm"
              onClick={toggleSort}
            >
              Sort
            </Button>
          </FormControl>
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
      <Box
        width="100%"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        mt={4}
        mb={5}
        sx={{ gridGap: 30 }}
      >
        {displayedRooms.map((room) => (
          <RoomCard key={room.id} room={room} handleBook={setSelectedRoom} datetimeStart={start.toISOString()} datetimeEnd={end.toISOString()} />
        ))}
      </Box>
    </>
  );
}
