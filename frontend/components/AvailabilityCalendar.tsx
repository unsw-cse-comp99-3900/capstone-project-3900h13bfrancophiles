import * as React from "react";

import { AnonymousBooking } from "@/types";
import { Calendar, dateFnsLocalizer, DateRange, ToolbarProps, EventProps } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek, endOfWeek } from "date-fns";
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { theme } from '@/app/ThemeRegistry';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Stack, ButtonGroup, Button, ToggleButtonGroup, Typography } from "@mui/joy";
import useUser from "@/hooks/useUser";
import { Event, StyledCalendarContainer, formatTime, formatTimeRange } from "@/utils/calendar"

interface AvailabilityCalendarProps {
  bookings: AnonymousBooking[],
}

const CustomToolBar : React.FC<ToolbarProps & Date> = ({
  view,
  onNavigate,
  onView,
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
          : `${format(date, 'dd MMM y')}`
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

const CustomEvent : React.FC<EventProps> = ({event}) => {
  const { user, isLoading, error } = useUser(event.zid);
  return (
    <>
      {isLoading || error ? "..." : user!.fullname}
    </>
  )
};

export default function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {

  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<String>('week');
  const events : Event[] = bookings
    .map((b) =>
      {
        return {
          zid: b.zid,
          start: new Date(b.starttime),
          end: new Date(b.endtime)
        }
      }
    )
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


  return (
    <StyledCalendarContainer>
      <Calendar
        startAccessor="start"
        style={{ height: 700 }}
        localizer={localizer}
        defaultView="agenda"
        onNavigate={handleDateChange}
        date={date}
        events={events}
        views={['day', 'week']}
        view={view}
        onView={handleViewChange}
        scrollToTime={new Date(0, 0, 0, 8)}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        components={{
            toolbar: (props : ToolbarProps) => ( <CustomToolBar {...props} date={date} /> ),
            event: CustomEvent
        }}
        endAccessor={({end}: Event) => {
          if (end.getHours() === 0 && end.getMinutes() === 0) return new Date(end.getTime() - 1) // for midnight dates
          return end
        }}
        formats={{
          timeGutterFormat: formatTime,
          eventTimeRangeFormat: formatTimeRange,
        }}
      />
    </StyledCalendarContainer>
  );
}
