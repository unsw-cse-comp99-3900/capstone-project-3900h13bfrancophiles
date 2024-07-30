import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  differenceInMinutes,
  endOfDay,
  format,
  getHours,
  getMinutes,
  isBefore,
  max,
  min,
  roundToNearestMinutes,
  setHours,
  setMinutes,
  startOfDay,
  startOfTomorrow,
} from "date-fns";
import React from "react";
import { InputProps } from "@mui/joy/Input";
import { JoyTimePickerProps } from "@/components/JoyTimePicker";
import { TimeRange } from "@/types";

const SINGLE_COLUMN_THRESHOLD = 12;

type UseTimeRangeOptions = {
  date?: Date;
  start?: Date;
  end?: Date;
  blockedTimes?: TimeRange[];
};

/**
 * Hook for creating date, start and end time state variables/inputs that
 * adhere to the rules of bookings:
 * - Date must be between today and a week from now
 * - Times must be after the current time
 * - Times must be on 15-minute boundaries
 * - Times must be at least 15 minutes apart
 * - End must be after start
 * To use this hook:
 * - Extract the { date, start, end } state variables for use where necessary
 * - Extract the XInputProps and provide them as input to each Input component,
 *   which will make it update the values and follow rules
 * - Optionally, extract the handleXChange functions to manually set states
 */
export default function useTimeRange(options: UseTimeRangeOptions = {}) {
  const now = roundToNearestMinutes(new Date(), { nearestTo: 15, roundingMethod: "ceil" });
  const today = startOfDay(now);
  const weekFromToday = addWeeks(today, 1);

  const [date, setDate] = React.useState(startOfDay(options.date ?? now));
  const [start, setStart] = React.useState<Date>(options.start ?? now);
  const [end, setEnd] = React.useState<Date>(
    options.end ?? min([addHours(now, 1), startOfTomorrow()]),
  );

  const handleDateChange = (newDate: Date) => {
    const startOfDate = startOfDay(newDate);
    setDate(startOfDate);
    const newStart = setHours(setMinutes(newDate, getMinutes(start)), getHours(start));
    handleStartChange(newStart, startOfDate);
  };

  const handleStartChange = (newStart: Date, date: Date) => {
    const startTime = max([newStart, now, date]);
    const limitedStart = min([startTime, setHours(setMinutes(date, 45), 23)]);
    const changeInTime = differenceInMinutes(limitedStart, start);
    setStart(limitedStart);

    const shiftedEnd = min([addMinutes(end, changeInTime), addDays(date, 1)]);
    handleEndChange(shiftedEnd, limitedStart);
  };

  const handleEndChange = (newEnd: Date, start: Date) => {
    if (newEnd.getHours() == 0 && newEnd.getMinutes() == 0) {
      setEnd(addDays(date, 1));
    } else {
      const adjustedEnd = new Date(start);
      adjustedEnd.setHours(newEnd.getHours(), newEnd.getMinutes());
      setEnd(adjustedEnd);
    }
  };

  const [startError, setStartError] = React.useState(false);
  const [endError, setEndError] = React.useState<boolean>(false);

  const dateInputProps: InputProps = {
    type: "date",
    value: format(date, "yyyy-MM-dd"),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
      handleDateChange(new Date(e.target.value));
    },
    slotProps: {
      input: {
        min: format(today, "yyyy-MM-dd"),
        max: format(weekFromToday, "yyyy-MM-dd"),
      },
    },
  };

  const [blockedTimes, setBlockedTimes] = React.useState<TimeRange[]>([]);
  React.useEffect(() => {
    setBlockedTimes(options.blockedTimes?.sort(cmpTimeRange) ?? []);
  }, [options.blockedTimes]);

  // Start must be greater than now, and start of day
  const shouldDisableStartTime = (time: Date) => {
    for (const { start, end } of blockedTimes) {
      if (!isBefore(time, start) && isBefore(time, end)) return true;
    }

    return isBefore(time, now) || isBefore(time, date);
  };

  const startTimePickerProps: JoyTimePickerProps = {
    value: start,
    onChange: (newStart, ctx) => {
      if (newStart && !ctx.validationError) handleStartChange(newStart, date);
    },
    onError: (error) => {
      setStartError(error !== null);
    },
    shouldDisableTime: shouldDisableStartTime,
    minutesStep: 15,
  };

  // End time can always be midnight, but must be at least start + 15m
  const shouldDisableEndTime = (time: Date) => {
    for (const blocked of blockedTimes) {
      if (isBefore(start, blocked.start)) {
        if (isBefore(blocked.start, time)) return true;
        if (time.getHours() == 0 && time.getMinutes() == 0) return true;
        break;
      }
    }

    if (time.getHours() == 0 && time.getMinutes() == 0) return false;

    const adjustedEnd = new Date(start);
    adjustedEnd.setHours(time.getHours(), time.getMinutes());
    return isBefore(adjustedEnd, addMinutes(start, 15));
  };

  const firstBlockedAfter = blockedTimes.find((blocked) => isBefore(start, blocked.start));
  const numValidEndTimes =
    differenceInMinutes(firstBlockedAfter?.start ?? endOfDay(start), start) / 15;

  const endTimePickerProps: JoyTimePickerProps = {
    value: end,
    onChange: (newEnd, ctx) => {
      if (newEnd && !ctx.validationError) handleEndChange(newEnd, start);
    },
    onError: (error) => {
      setEndError(error !== null);
    },
    shouldDisableTime: shouldDisableEndTime,
    minutesStep: 15,
    referenceDate: date,
    showMidnightButton: true,
    singleColumn: numValidEndTimes <= SINGLE_COLUMN_THRESHOLD,
  };

  return {
    date,
    start,
    end,
    handleDateChange,
    handleStartChange,
    handleEndChange: setEnd,
    dateInputProps,
    startTimePickerProps,
    endTimePickerProps,
    startError,
    endError,
  };
}

function cmpTimeRange(a: TimeRange, b: TimeRange) {
  return a.start.getTime() - b.start.getTime();
}
