import * as React from "react";

import { Calendar, dateFnsLocalizer, DateRange, ToolbarProps, EventProps } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek, endOfWeek } from "date-fns";
import { enAU } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useUser from "@/hooks/useUser";
import { Event, StyledCalendarContainer, formatTime, formatTimeRange } from "@/utils/calendar"
import useAvailabilities from "@/hooks/useAvailabilities";
import Loading from "../Loading";
import * as jwt from "jsonwebtoken";
import {getCookie} from "cookies-next";
import { roundToInterval } from "@/hooks/useTimeRange";


interface ModalCalendarProps {
  space: string | undefined,
  date: Date,
  start: Date,
  end: Date,
}

interface MyEvent extends Event {
  color?: string
  unConfirmed?: boolean
}

const CustomEvent : React.FC<EventProps> = ({event}) => {
  const { user, isLoading, error } = useUser(event.zid);
  return (
    <Box sx={{
      backgroundColor: event.color ?? "",
    }}>
      {isLoading || error ? "..." : (event.unConfirmed ? "New Booking" : user!.fullname) } {}
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

export default function ModalCalendar({ space, date, start, end }: ModalCalendarProps) {
  if (!space) return <Loading page=""/>

  const theme = useTheme()
  const { bookings } = useAvailabilities(space)

  const token = getCookie('token');
  const decoded = jwt.decode(`${token}`) as jwt.JwtPayload;
  const curUser = decoded.user;

  // const { user } = useUser()
  if (!bookings) return <Loading page=""/>
  const events : MyEvent[] = bookings
    .map((b) =>
      {
        return {
          zid: b.zid,
          start: new Date(b.starttime),
          end: new Date(b.endtime)
        }
      }
    )
  let overlaps = false
  events.forEach(e => {
    if (e.start < end && e.end > start) overlaps = true;
  })
  events.push({
    zid: curUser,
    start: roundToInterval(start),
    end: roundToInterval(end),
    // color: overlaps ? theme.palette.warning.main : theme.palette.primary.main,
    color: overlaps ? "#C70039" : "green",
    unConfirmed: true
  })

  return (
    <MyStyledCalendarContainer>
      <Calendar
        startAccessor="start"
        localizer={localizer}
        defaultView="day"
        style={{ height: 405 }}
        date={date}
        scrollToTime={start}
        events={events}
        view={"day"}
        slotGroupPropGetter={() => ({ style: { minHeight: "50px" } })}
        eventPropGetter={eventStyleGetter}
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

