"use client";

import RoomCard from "@/app/components/roomCard";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
  TextField,
} from "@mui/joy";

const renderFilters = () => (
  <React.Fragment>
    <FormControl size="sm">
      <FormLabel>Type</FormLabel>
      <Select
        size="sm"
        placeholder="Filter by room type"
        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
      >
        <Option value="meeting-room">Meeting Room</Option>
        <Option value="consult-room">Consult Room</Option>
        <Option value="conference-room">Conference Room</Option>
      </Select>
    </FormControl>
    <FormControl size="sm">
      <FormLabel>Capacity</FormLabel>
      <Select size="sm" placeholder="All">
        <Option value="all">All</Option>
        <Option value="refund">1+</Option>
        <Option value="purchase">2+</Option>
        <Option value="debit">3+</Option>
        <Option value="debit">4+</Option>
        <Option value="debit">5+</Option>
        <Option value="debit">6+</Option>
      </Select>
    </FormControl>
    <FormControl size="sm">
      <FormLabel>Customer</FormLabel>
      <Select size="sm" placeholder="All">
        <Option value="all">All</Option>
        <Option value="olivia">Olivia Rhye</Option>
        <Option value="steve">Steve Hampton</Option>
        <Option value="ciaran">Ciaran Murray</Option>
        <Option value="marina">Marina Macdonald</Option>
        <Option value="charles">Charles Fulton</Option>
        <Option value="jay">Jay Hoper</Option>
      </Select>
    </FormControl>
  </React.Fragment>
);

export default function Rooms() {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
	const [sort, setSort] = React.useState(false);

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

	const toggleSort = () => {
		setSort(!sort);
	}

  return (
    <>
      <Box
        className="SearchAndFilters"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "nowrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
          alignItems: "center",
        }}
      >
        <FormControl sx={{ flex: 2 }} size="sm">
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        <FormControl size="sm">
          <Input
            type="date"
            slotProps={{
              input: {
                min: "2018-06-07",
                max: "2020-06-14",
              },
            }}
          />
        </FormControl>
        <FormControl size="sm">
          <Box sx={{ display: "flex", gap: 2 }}>
            <Input
              type="time"
							defaultValue=""

              size="sm"
              sx={{ width: "100%" }}
            />
            <Input
              type="time"
              defaultValue=""
              size="sm"
              sx={{ width: "100%" }}
            />
          </Box>
        </FormControl>

        <Button
          startDecorator={<FilterListIcon />}
          variant="soft"
          color="neutral"
          size="sm"
          onClick={toggleFilters}
        >
          Filter
        </Button>
				<Button
          startDecorator={<SwapVertIcon />}
          variant="soft"
          color="neutral"
          size="sm"
          onClick={toggleSort}
        >
          Sort
        </Button>
      </Box>

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
              {/* TODO: Make this actually apply the filter */}
              Apply filters
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <RoomCard />
    </>
  );
}
