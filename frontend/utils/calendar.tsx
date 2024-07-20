import { dateFnsLocalizer, DateRange } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Box, { BoxProps } from "@mui/joy/Box";
import { styled } from "@mui/material/styles";

export interface Event {
  zid: number,
  start: Date,
  end: Date
}

export const StyledCalendarContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    "& .rbc-time-slot, & .rbc-day-slot, & .rbc-timeslot-group": {
      borderColor: `${theme.palette.background.paper} !important`,
    },
    "& .rbc-allday-cell": {
      display: "none",
    },
    "& .rbc-time-view .rbc-header": {
      borderColor: theme.palette.background.paper,
      borderBottom: "none",
    },
    "& .rbc-events-container": {
      borderColor: theme.palette.background.paper,
      margin: "1px !important",
    },
    "& .rbc-header": {
      padding: "5px 0",
      fontSize: 16,
    },
    "& .rbc-event-content": {
      fontWeight: 500,
    },
    "& .rbc-time-view": {
      borderColor: theme.palette.background.paper,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      border: "none",
      borderRadius: "12px",
    },
    "& .rbc-header:last-child, & .rbc-time-header": {
      borderTopRightRadius: "12px",
      borderRight: "none !important",
    },
    "& .rbc-time-slot": {
      margin: "auto"
    },
  })
);


export const formatTime = (
  date: Date,
  culture: string | undefined,
  localizer?: dateFnsLocalizer
) => {
  if (!localizer) {
    throw new Error("No date localizer");
  }
  if (date.getHours() === 23 && date.getMinutes() === 59) date = new Date(date.getTime() + 1) // for midnight fix
  let res = localizer.format(date, "h", culture);
  if (date.getMinutes() !== 0) {
    res += localizer.format(date, ":mm", culture);
  }
  res += localizer.format(date, " a", culture);
  return res;
};

export const formatTimeRange = (
  { start, end }: DateRange,
  culture: string | undefined,
  localizer?: dateFnsLocalizer
) => {
  return (
    formatTime(start, culture, localizer) +
    " - " +
    formatTime(end, culture, localizer)
  );
};
