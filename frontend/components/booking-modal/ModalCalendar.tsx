import * as React from "react";

import { Calendar, dateFnsLocalizer, EventProps } from "react-big-calendar";
import { endOfDay, format, getDay, parse, startOfDay, startOfWeek } from "date-fns";
import { enAU } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import useUser from "@/hooks/useUser";
import { Event, StyledCalendarContainer, formatTime, formatTimeRange } from "@/utils/calendar";
import useAvailabilities from "@/hooks/useAvailabilities";
import Loading from "@/components/feedback/Loading";
import { roundToNearestMinutes } from "date-fns";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@/app/ThemeRegistry";
import { getCookie } from "cookies-next";
import { TimeRange, TokenPayload } from "@/types";
import { useRef } from "react";
import { decodeJwt } from "jose";

interface ModalCalendarProps {
  space: string | undefined;
  date: Date;
  start: Date;
  end: Date;
  editedBookingId?: number;
  setBlockedTimes: (val: TimeRange[]) => void;
}

interface MyEvent extends Event {
  color?: string;
  type?: "New" | "Old";
  ref?: React.RefObject<HTMLDivElement>;
}

const CustomEvent: React.FC<EventProps<MyEvent>> = ({ event }) => {
  const { user, isLoading, error } = useUser(event.zid);
  return (
    <Box ref={event.ref}>
      {event.type ? `${event.type} Booking` : isLoading || error ? "..." : user!.fullname}
    </Box>
  );
};

const MyStyledCalendarContainer = styled(StyledCalendarContainer)`
  .rbc-time-content {
    border-top: none;
  }
  .rbc-event {
    border: none !important;
  }
`;

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: enAU,
});

const eventStyleGetter = (event: MyEvent) => {
  const color = event.color ?? "";
  return { style: { backgroundColor: color } };
};

export default function ModalCalendar({
  space,
  date,
  start,
  end,
  editedBookingId,
  setBlockedTimes,
}: ModalCalendarProps) {
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm")) ?? false;

  const [calendarStart, setCalendarStart] = React.useState<Date>(startOfDay(date));
  const [calendarEnd, setCalendarEnd] = React.useState<Date>(endOfDay(date));
  React.useEffect(() => {
    setCalendarStart(startOfDay(date));
    setCalendarEnd(endOfDay(date));
  }, [date]);

  const { bookings, isLoading } = useAvailabilities(
    space!,
    calendarStart.toISOString(),
    calendarEnd.toISOString(),
  );
  React.useEffect(() => {
    if (bookings) {
      setBlockedTimes(
        bookings
          .filter((booking) => booking.id !== editedBookingId)
          .map((booking) => ({
            start: new Date(booking.starttime),
            end: new Date(booking.endtime),
          })),
      );
    }
  }, [bookings, editedBookingId, setBlockedTimes]);

  // Scroll the calendar when start time changes
  const newBookingEventRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const calendarEl = newBookingEventRef.current?.closest<HTMLDivElement>(".rbc-time-content");
    const eventEl = newBookingEventRef.current?.closest<HTMLDivElement>(".rbc-event");
    if (!calendarEl || !eventEl || !("scrollTo" in calendarEl)) return;

    const calendarHeight = calendarEl.getBoundingClientRect().height;
    calendarEl.scrollTo({
      behavior: "smooth",
      top: eventEl.offsetTop - calendarHeight / 5,
      left: 0,
    });
  }, [start]);

  if (isLoading) return <Loading page="" />;

  const events: MyEvent[] = bookings!.map((b) => {
    const old = b.id === editedBookingId;
    return {
      zid: b.zid,
      start: new Date(b.starttime),
      end: new Date(b.endtime),
      type: old ? "Old" : undefined,
      color: old ? "rgba(49, 116, 173, 0.6)" : undefined,
    };
  });
  let overlaps = false;
  bookings!.forEach((b) => {
    if (b.id === editedBookingId) return;
    if (new Date(b.starttime) < end && new Date(b.endtime) > start) overlaps = true;
  });

  const tokenPayload = decodeJwt<TokenPayload>(`${getCookie("token")}`);
  events.push({
    zid: tokenPayload.user,
    start: roundToNearestMinutes(start, { nearestTo: 15 }),
    end: roundToNearestMinutes(end, { nearestTo: 15 }),
    color: overlaps ? "#C70039" : "green",
    type: "New",
    ref: newBookingEventRef,
  });

  return (
    <MyStyledCalendarContainer>
      <Calendar
        startAccessor="start"
        localizer={localizer}
        defaultView="day"
        style={{ height: isMobile ? 230 : 400 }}
        defaultDate={date}
        scrollToTime={start}
        events={events}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={() => ({ style: { backgroundColor: "#fbfcfe" } })}
        components={{
          event: CustomEvent,
        }}
        endAccessor={({ end }: Event) => {
          if (end.getHours() === 0 && end.getMinutes() === 0) return new Date(end.getTime() - 1); // for midnight dates
          return end;
        }}
        toolbar={false}
        formats={{
          timeGutterFormat: formatTime,
          eventTimeRangeFormat: formatTimeRange,
        }}
        selectable={false}
      />
    </MyStyledCalendarContainer>
  );
}
