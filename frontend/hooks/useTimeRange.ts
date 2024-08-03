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
 * - Times cannot overlap with any current bookings
 *
 * @param options.date initial date
 * @param options.start initial start time
 * @param options.end initial end time
 * @param options.blockedTimes list of booked ranges that should be blocked
 *
 * @returns Object containing:
 * - { date, start, end } - state variables
 * - { dateInputProps, startTimePickerProps, endTimePickerProps } - props to pass to Input or
 *   JoyTimePicker components to make them follow the rules and update state
 * - { startError, endError } - whether there is currently an error
 * - { handleDateChange, handleStartChange, handleEndChange } - functions to manually trigger
 *   changes
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
    // Fix date to start of day
    const startOfDate = startOfDay(newDate);
    setDate(startOfDate);

    // Move start to new date
    const newStart = setHours(setMinutes(newDate, getMinutes(start)), getHours(start));
    handleStartChange(newStart, startOfDate);
  };

  const handleStartChange = (newStart: Date, date: Date) => {
    // Ensure start is in range
    const startTime = max([newStart, now, date]);
    const limitedStart = min([startTime, setHours(setMinutes(date, 45), 23)]);
    const changeInTime = differenceInMinutes(limitedStart, start);
    setStart(limitedStart);

    // Shift end by an equal amount that start was shifted
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

  // Total number of valid end times is all between start and next booking
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

/**
 * Compare two time ranges - for sorting
 */
function cmpTimeRange(a: TimeRange, b: TimeRange) {
  return a.start.getTime() - b.start.getTime();
}
