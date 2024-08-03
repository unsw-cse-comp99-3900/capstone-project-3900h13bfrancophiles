import * as React from "react";

import { Calendar, dateFnsLocalizer, ToolbarProps, EventProps, View } from "react-big-calendar";
import { format, getDay, parse, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { enAU } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { theme } from "@/app/ThemeRegistry";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Stack, ButtonGroup, Button, ToggleButtonGroup, Typography } from "@mui/joy";
import useUser from "@/hooks/useUser";
import { Event, StyledCalendarContainer, formatTime, formatTimeRange } from "@/utils/calendar";
import useAvailabilities from "@/hooks/useAvailabilities";
import Loading from "@/components/feedback/Loading";

interface AvailabilityCalendarProps {
  spaceId: string;
  calendarStart: Date;
  calendarEnd: Date;
  setCalendarStart: React.Dispatch<React.SetStateAction<Date>>;
  setCalendarEnd: React.Dispatch<React.SetStateAction<Date>>;
}

const CustomToolBar: React.FC<ToolbarProps> = ({ view, onNavigate, onView, date }) => {
  return (
    <Stack direction="row" justifyContent="space-between" mb={2}>
      <ButtonGroup sx={{ height: 30 }}>
        <Button onClick={() => onNavigate("PREV")}>Back</Button>
        <Button onClick={() => onNavigate("TODAY")}>Today</Button>
        <Button onClick={() => onNavigate("NEXT")}>Next</Button>
      </ButtonGroup>
      <Typography sx={{ margin: "auto" }}>
        {view === "week"
          ? `${format(startOfWeek(date), "dd MMM")} - ${format(endOfWeek(date), "dd MMM")}`
          : `${format(date, "dd MMM y")}`}
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

const CustomEvent: React.FC<EventProps<Event>> = ({ event }) => {
  const { user, isLoading, error } = useUser(event.zid);
  return <>{isLoading || error ? "..." : user!.fullname}</>;
};

export default function AvailabilityCalendar({
  spaceId,
  calendarStart,
  calendarEnd,
  setCalendarStart,
  setCalendarEnd,
}: AvailabilityCalendarProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<View>("week");
  const { bookings, isLoading } = useAvailabilities(
    spaceId,
    calendarStart.toISOString(),
    calendarEnd.toISOString(),
  );

  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md")) ?? false;
  React.useEffect(() => {
    setView(isMobile ? "day" : "week");
  }, [isMobile]);

  React.useEffect(() => {
    if (view === "week") {
      setCalendarStart(startOfWeek(date));
      setCalendarEnd(endOfWeek(date));
    } else {
      setCalendarStart(startOfDay(date));
      setCalendarEnd(endOfDay(date));
    }
  }, [date, view]);

  if (isLoading) return <Loading page="" />;

  const events: Event[] = bookings!.map((b) => {
    return {
      zid: b.zid,
      start: new Date(b.starttime),
      end: new Date(b.endtime),
    };
  });

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate ?? new Date());
  };

  const handleViewChange = (newView: View | null) => {
    setView(newView ?? "week");
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: enAU,
  });

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
        views={["day", "week"]}
        view={view}
        onView={handleViewChange}
        scrollToTime={new Date(0, 0, 0, 8)}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        components={{
          toolbar: (props: ToolbarProps) => <CustomToolBar {...props} date={date} />,
          event: CustomEvent,
        }}
        endAccessor={({ end }: Event) => {
          if (end.getHours() === 0 && end.getMinutes() === 0) return new Date(end.getTime() - 1); // for midnight dates
          return end;
        }}
        formats={{
          timeGutterFormat: formatTime,
          eventTimeRangeFormat: formatTimeRange,
        }}
      />
    </StyledCalendarContainer>
  );
}
