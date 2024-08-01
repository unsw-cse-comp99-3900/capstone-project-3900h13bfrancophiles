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
import useReportTypes from "@/hooks/useReportTypes";
import * as api from "@/api";
import { ReportSpace } from "@/types";
import useReportSpaces from "@/hooks/useReportSpaces";

interface ReportType {
  type: string;
  name: string;
  formats: string[];
}

export function ReportGenerationForm() {
  const { types: reportTypes = [], isLoading: typesIsLoading } = useReportTypes();
  const [reportType, setReportType] = React.useState<ReportType>();
  React.useEffect(() => {
    if (!reportType) setReportType(reportTypes[0]);
  }, [reportTypes]);

  const [fileFormat, setFileFormat] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (reportType) setFileFormat(reportType.formats[0]);
  }, [reportType]);

  const { spaces: reportSpaces, isLoading: spacesIsLoading } = useReportSpaces();
  const options: ReportSpace[] = [
    { text: "All Desks", value: "all", type: "desk" },
    { text: "All Rooms", value: "all", type: "room" },
    ...(reportSpaces ?? [])
  ];

  const today = startOfToday();
  const [startDate, setStartDate] = React.useState(addDays(today, -7));
  const [endDate, setEndDate] = React.useState(today);

  const [spaces, setSpaces] = React.useState<ReportSpace[]>([]);
  const totals = {
    room: options.filter((space) => space.type === "room").length - 1,
    desk: options.filter((space) => space.type === "desk").length - 1,
  };
  const selected = {
    room: spaces.filter((space) => space.type === "room").length,
    desk: spaces.filter((space) => space.type === "desk").length,
  };

  const [spacesInteracted, setSpacesInteracted] = React.useState(false);
  const spacesError = (spacesInteracted && spaces.length == 0)
    ? "Select at least one space" : undefined;

  const handleAllSwitch = (type: ReportSpace["type"]) => {
    if (totals[type] == selected[type]) {
      setSpaces((spaces) => spaces.filter((space) => space.type !== type));
    } else {
      setSpaces((spaces) => [
        ...options.filter((space) => space.type === type && space.value !== "all"),
        ...spaces.filter((space) => space.type !== type),
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
    option: ReportSpace,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _state: AutocompleteRenderOptionState,
  ) => {
    // @ts-expect-error - key is passed in but the type doesn't include it for some reason
    // eslint-disable-next-line react/prop-types
    const { key, ...otherProps } = props;

    if (!option.level) {
      return (
        <Stack
          key={option.text}
          direction="row"
          width="100%"
          justifyContent="space-between"
          p={1.5}
          py={1}
        >
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

  const handleSubmit = async () => {
    setSpacesInteracted(true);
    if (!reportType || !fileFormat || !spaces.length) return;
    const res = await api.generateReport(
      reportType.type,
      fileFormat,
      startDate,
      endDate,
      spaces.map((option) => option.value),
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Extract filename
    const header = res.headers.get('Content-Disposition');
    const parts = header!.split(';');
    const quotedFilename = parts[1].split('=')[1];
    a.download = quotedFilename.substring(1, quotedFilename.length - 1);

    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      width="auto"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 200, flexGrow: { xs: 1, sm: 0 } }}>
            <FormLabel>Report Type</FormLabel>
            <Select
              placeholder="Select one..."
              value={reportType?.type}
              onChange={(_e, value) => {
                setReportType(reportTypes.find((rt) => rt.type === value));
              }}
            >
              {reportTypes && reportTypes.map((rt) => (
                <Option key={rt.type} value={rt.type}>{rt.name}</Option>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 70, flexGrow: { xs: 1, sm: 0 } }}>
            <FormLabel>Format</FormLabel>
            <Select
              value={fileFormat}
              onChange={(_e, value) => setFileFormat(value)}
            >
              {reportType && reportType.formats.map((format) => (
                <Option key={format} value={format}>.{format}</Option>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
          color={spacesError ? "danger" : "neutral"}
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
          loading={spacesIsLoading}
          onChange={(_e, values) => setSpaces(values)}
          onBlur={() => setSpacesInteracted(true)}
          slotProps={{
            root: { ref: autocompleteRef },
          }}
        />
        {spacesError && (
          <Typography color="danger" level="body-xs" fontWeight={400} ml={0.5}>
            {spacesError}
          </Typography>
        )}
      </Box>
      <Button
        endDecorator={<DownloadIcon />}
        size="lg"
        sx={{
          mt: "20px !important",
          flexShrink: 0,
        }}
        loading={spacesIsLoading || typesIsLoading}
        onClick={handleSubmit}
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
      {params.group && <ListSubheader sticky>{params.group}</ListSubheader>}
      <List>{params.children}</List>
    </ListItem>
  );
};

// Stolen from JoyUI Autocomplete source code
const renderTags = (tags: ReportSpace[], getTagProps: AutocompleteRenderGetTagProps) =>
  tags.map((item, index) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, onClick, ...tagProps } = getTagProps({ index });
    return (
      <Chip
        variant="soft"
        color="neutral"
        endDecorator={<ChipDelete
          variant="soft"
          key={key}
          onDelete={onClick}
          {...tagProps}
        />}
        sx={{ minWidth: 0 }}
        key={key}
      >
        {item.text}
      </Chip>
    );
  });
