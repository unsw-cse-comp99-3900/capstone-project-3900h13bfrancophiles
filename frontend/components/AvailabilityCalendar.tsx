import * as React from "react";

import { Booking } from "@/types";
import { Calendar, dateFnsLocalizer, DateLocalizer } from 'react-big-calendar'
import { format, getDay, isToday, parse, startOfWeek } from "date-fns";
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";

interface AvailabilityCalendarProps {
  bookings: Booking[];
}


export default function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {
  console.log(bookings)
  const [date, setDate] = React.useState<Date>(new Date());
  const [view ,setView] = React.useState<String>('week');

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate ?? new Date());
  };

  const handleViewChange = (newView: String | null) => {
    setView(newView ?? 'week');
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: enAU,
  })

  const StyledCalendarContainer = styled(Box)<BoxProps>(
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
    })
  );

  return (
    <StyledCalendarContainer>
      <Calendar
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        localizer={localizer}
        defaultView="agenda"
        onNavigate={handleDateChange}
        date={date}
        events={[
          {
            title: "event",
            start: new Date("2024-07-07T05:30Z"),
            end: new Date("2024-07-07T08:30Z"),
          }
        ]}
        views={['day', 'week', 'agenda']}
        view={view}
        onView={handleViewChange}
        min={new Date(0, 0, 0, 8)}
        max={new Date(0, 0, 0, 20)}
      />
    </StyledCalendarContainer>
  );
}
