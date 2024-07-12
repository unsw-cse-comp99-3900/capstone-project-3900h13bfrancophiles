import * as React from "react";

import { AnonymousBooking } from "@/types";
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek, endOfWeek } from "date-fns";
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Stack, ButtonGroup, Button, ToggleButtonGroup, Typography } from "@mui/joy";

interface AvailabilityCalendarProps {
  bookings: AnonymousBooking[],
}

interface Event {
  title: String,
  start: Date,
  end: Date
}

const CustomToolBar: React.FC<ToolbarProps & Date> = ({
  view,
  onNavigate,
  onView,
  label,
  date
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      mb={2}
    >
      <ButtonGroup sx={{ height: 30 }}>
        <Button onClick={() => onNavigate("PREV")}>
          Back
        </Button>
        <Button onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button onClick={() => onNavigate("NEXT")}>
          Next
        </Button>
      </ButtonGroup>
      <Typography sx={{ margin: "auto" }}>
        {
          view === "week" ? `${format(startOfWeek(date), 'dd MMM')} - ${format(endOfWeek(date), 'dd MMM')}`
          : `${format(date, 'dd MMM Y')}`
        }
      </Typography>
      <ToggleButtonGroup
        value={view}
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            display: "none",
          },
        })}
      >
        <Button value="week" onClick={() => onView("week")}>
          Week
        </Button>
        <Button value="day" onClick={() => onView("day")}>
          Day
        </Button>
      </ToggleButtonGroup>
    </Stack>
  );
};



export default function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<String>('week');
  const events : Event[] = bookings
    .map((b) =>
      {
        return {
          title: `BOOKED`,
          start: new Date(b.starttime),
          end: new Date(b.endtime)
        }
      }
    )
  const theme = useTheme()
  const isMobile : Boolean = useMediaQuery(theme.breakpoints.down("md")) ?? false;
  React.useEffect(() => {
    setView(isMobile ? 'day' : 'week');
  }, [isMobile]);

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
        events={events}
        views={['day', 'week']}
        view={view}
        onView={handleViewChange}
        min={new Date(0, 0, 0, 8)}
        max={new Date(0, 0, 0, 20)}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        components={{
            toolbar: (props : ToolbarProps) => ( <CustomToolBar {...props} date={date} /> ),
        }}
      />
    </StyledCalendarContainer>
  );
}
