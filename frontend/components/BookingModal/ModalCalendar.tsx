import * as React from "react";

import { Calendar, dateFnsLocalizer, EventProps } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import useUser from "@/hooks/useUser";
import { Event, StyledCalendarContainer, formatTime, formatTimeRange } from "@/utils/calendar"
import useAvailabilities from "@/hooks/useAvailabilities";
import Loading from "../Loading";
import { roundToNearestMinutes } from 'date-fns';
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from '@/app/ThemeRegistry';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { TimeRange } from '@/types';

interface ModalCalendarProps {
  space: string | undefined,
  date: Date,
  start: Date,
  end: Date,
  editing?: boolean
  editedBooking?: number,
  setBlockedTimes: (val: TimeRange[]) => void;
}

interface MyEvent extends Event {
  color?: string
  new?: boolean
  edited?: boolean
  old?: boolean
}

const CustomEvent : React.FC<EventProps<MyEvent>> = ({event}) => {
  const { user, isLoading, error } = useUser(event.zid);
  let adjective = ""
  if (event.new) adjective = "New"
  if (event.edited) adjective = "New"
  if (event.old) adjective = "Old"
  return (
    <Box>
      {adjective ? `${adjective} Booking` : (isLoading || error ? "..." : user!.fullname) }
    </Box>
  )
};

const MyStyledCalendarContainer = styled(StyledCalendarContainer)`
  .rbc-time-content {
    border-top: none
  }
  .rbc-event {
    border: none !important
  }
`

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: enAU,
})

const eventStyleGetter = (event: MyEvent) => {
  const color = event.color ?? ""
  return { style: { backgroundColor: color } }
}

export default function ModalCalendar({
  space,
  date,
  start,
  end,
  editing,
  editedBooking,
  setBlockedTimes
}: ModalCalendarProps) {
  const isMobile : Boolean = useMediaQuery(theme.breakpoints.down("sm")) ?? false;

  const { bookings, isLoading } = useAvailabilities(space!)
  React.useEffect(() => {
    if (bookings) {
      setBlockedTimes(bookings.map(booking => ({
        start: new Date(booking.starttime),
        end: new Date(booking.endtime),
      })));
    }
  }, [bookings])

  if (isLoading) return <Loading page=""/>
  const events : MyEvent[] = bookings!
    .map((b) =>
      {
        const old = b.id === editedBooking
        return {
          zid: b.zid,
          start: new Date(b.starttime),
          end: new Date(b.endtime),
          old: old,
          color: old ? "rgba(49, 116, 173, 0.6)" : ""
        }
      }
    )
  let overlaps = false
  bookings!.forEach(b => {
    if (b.id === editedBooking) return;
    if (new Date(b.starttime) < end && new Date(b.endtime) > start) overlaps = true;
  })

  const token = jwt.decode(`${getCookie('token')}`) as jwt.JwtPayload;
  events.push({
    zid: token.user,
    start: roundToNearestMinutes(start, { nearestTo: 15 }),
    end: roundToNearestMinutes(end, { nearestTo: 15 }),
    // color: overlaps ? theme.palette.warning.main : theme.palette.primary.main,
    color: overlaps ? "#C70039" : "green",
    new: !editing,
    edited: editing
  })

  return (
    <MyStyledCalendarContainer>
      <Calendar
        startAccessor="start"
        localizer={localizer}
        defaultView="day"
        style={{ height: isMobile ? 230 : 400 }}
        date={date}
        scrollToTime={start}
        events={events}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={() => ({ style: { backgroundColor: "#fbfcfe" } })}
        components={{
            event: CustomEvent
        }}
        endAccessor={({end}: Event) => {
          if (end.getHours() === 0 && end.getMinutes() === 0) return new Date(end.getTime() - 1) // for midnight dates
          return end
        }}
        toolbar={false}
        formats={{
          timeGutterFormat: formatTime,
          eventTimeRangeFormat: formatTimeRange,
        }}
        selectable={false}
      />
    </MyStyledCalendarContainer>
  )

}

