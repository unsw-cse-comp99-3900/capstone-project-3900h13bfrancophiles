"use client";

import {
  Autocomplete,
  AutocompleteOption,
  AutocompleteRenderGroupParams,
  Box,
  Button,
  Chip,
  ChipDelete,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  ListSubheader,
  Option,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import * as React from "react";
import { useRef } from "react";
import { AutocompleteRenderGetTagProps, AutocompleteRenderOptionState } from "@mui/joy/Autocomplete/AutocompleteProps";
import { addDays, format, startOfToday } from "date-fns";
import { useResizeObserver } from "usehooks-ts";

interface Option {
  text: string;
  value: string;
  type: "room" | "desk";
  level?: string;
}

// TODO: Fetch from backend
const options: Option[] = [
  { text: "All Desks", value: "all", type: "desk" },
  { text: "All Rooms", value: "all", type: "room" },
  { text: "K17 Room 201-B", value: "K-K17-201B", type: "room", level: "K17 L2" },
  { text: "K17 Room 201 Desks", value: "K-K17-201", type: "desk", level: "K17 L2" },
  { text: "K17 Room 217 Desks", value: "K-K17-217", type: "desk", level: "K17 L2" },
  { text: "K17 Room 401 K", value: "K-K17-401K", type: "room", level: "K17 L4" },
  { text: "K17 Room 402", value: "K-K17-402", type: "room", level: "K17 L4" },
  { text: "K17 Room 403", value: "K-K17-403", type: "room", level: "K17 L4" },
  { text: "K17 Room 401 Desks", value: "K-K17-401", type: "desk", level: "K17 L4" },
  { text: "K17 Room 412 Desks", value: "K-K17-412", type: "desk", level: "K17 L4" },
];

interface ReportType {
  type: string;
  name: string;
  supportedFormats: string[];
}

// TODO: Fetch from backend?
const reportTypes: ReportType[] = [
  { type: "booking", name: "Booking Information", supportedFormats: ["xlsx"] },
  { type: "checkin", name: "Booking & Check-in Information", supportedFormats: ["xlsx"] },
];

export function ReportGenerationForm() {
  const [reportType, setReportType] = React.useState<ReportType>();

  const today = startOfToday();
  const [startDate, setStartDate] = React.useState(addDays(today, -7));
  const [endDate, setEndDate] = React.useState(today);

  const [spaces, setSpaces] = React.useState<Option[]>([]);
  const totals = {
    room: options.filter(space => space.type === "room").length - 1,
    desk: options.filter(space => space.type === "desk").length - 1,
  };
  const selected = {
    room: spaces.filter(space => space.type === "room").length,
    desk: spaces.filter(space => space.type === "desk").length,
  };

  const handleAllSwitch = (type: Option["type"]) => {
    if (totals[type] == selected[type]) {
      setSpaces(spaces => spaces.filter(space => space.type !== type));
    } else {
      setSpaces(spaces => [
        ...options.filter(space => space.type === type && space.value !== "all"),
        ...spaces.filter(space => space.type !== type),
      ]);
    }
  };

  const autocompleteRef = useRef(null);
  const { width } = useResizeObserver({
    ref: autocompleteRef,
    box: "border-box",
  });

  const renderOption = (
    props: Omit<React.HTMLAttributes<HTMLLIElement>, "color">,
    option: Option,
    _state: AutocompleteRenderOptionState,
  ) => {
    // @ts-ignore - key is passed in but the type doesn't include it for some reason
    const { key, ...otherProps } = props;

    if (!option.level) {
      return (
        <Stack key={option.text} direction="row" width="100%" justifyContent="space-between" p={1.5} py={1}>
          <Typography>{option.text}</Typography>
          <Switch
            onChange={() => handleAllSwitch(option.type)}
            checked={totals[option.type] == selected[option.type]}
          />
        </Stack>
      );
    } else {
      return (
        <AutocompleteOption key={key} {...otherProps}>
          {option.text}
        </AutocompleteOption>
      );
    }
  };

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      width="auto"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ minWidth: 300, flexGrow: { xs: 1, sm: 0 } }}>
          <FormLabel>Report Type</FormLabel>
          <Select
            placeholder="Select one..."
            value={reportType?.type}
            onChange={(_e, value) => {
              setReportType(reportTypes.find((rt) => rt.type === value));
            }}
          >
            <Option value="booking">Booking Information</Option>
            <Option value="checkin">Booking & Check-in Information</Option>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2}>
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
                setStartDate(new Date(e.target.value));
              }}
              slotProps={{
                input: { max: format(endDate, "yyyy-MM-dd") },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
                setEndDate(new Date(e.target.value));
              }}
              slotProps={{
                input: {
                  min: format(startDate, "yyyy-MM-dd"),
                  max: format(today, "yyyy-MM-dd"),
                },
              }}
            />
          </FormControl>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <FormLabel sx={{ marginBottom: "6px" }}>Spaces</FormLabel>
        <Autocomplete
          placeholder={spaces.length ? undefined : "Select spaces to include in report..."}
          multiple
          disableCloseOnSelect
          limitTags={width ? Math.floor((width - 80) / 150) : -1}
          options={options}
          groupBy={(option) => option.level ?? ""}
          getOptionLabel={(option) => option.text}
          renderGroup={renderGroup}
          renderOption={renderOption}
          renderTags={renderTags}
          value={spaces}
          onChange={(_e, values) => setSpaces(values)}
          slotProps={{
            root: { ref: autocompleteRef },
          }}
        />
      </Box>
      <Button
        endDecorator={<DownloadIcon />}
        size="lg"
        sx={{
          mt: "20px !important",
          flexShrink: 0,
        }}
      >
        Download Report
      </Button>
    </Stack>
  );
}

// Stolen from JoyUI Autocomplete source code
const renderGroup = (params: AutocompleteRenderGroupParams) => {
  return (
    <ListItem key={params.key} nested>
      {params.group && (
        <ListSubheader sticky>{params.group}</ListSubheader>
      )}
      <List>{params.children}</List>
    </ListItem>
  );
};

// Stolen from JoyUI Autocomplete source code
const renderTags = (
  tags: Option[],
  getTagProps: AutocompleteRenderGetTagProps,
) => (
  tags.map((item, index) => {
    const { key, onClick, ...tagProps } = getTagProps({ index });
    return (
      <Chip
        variant="soft"
        color="neutral"
        endDecorator={<ChipDelete key={key} variant="soft" {...tagProps} />}
        sx={{ minWidth: 0 }}
        key={key}
      >
        {item.text}
      </Chip>
    );
  })
);
