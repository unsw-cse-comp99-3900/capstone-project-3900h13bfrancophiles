import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  differenceInMinutes,
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
  startOfTomorrow
} from 'date-fns';
import React from 'react';
import { InputProps } from '@mui/joy/Input';
import { JoyTimePickerProps } from '@/components/JoyTimePicker';

type InitialValues = {
  date?: Date;
  start?: Date;
  end?: Date;
}

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
export default function useTimeRange(initialValues: InitialValues = {}) {
  const now = roundToNearestMinutes(new Date(), { nearestTo: 15, roundingMethod: "ceil" });
  const today = startOfDay(now);
  const weekFromToday = addWeeks(today, 1);

  const [date, setDate] = React.useState(
    startOfDay(initialValues.date ?? now)
  );
  const [start, setStart] = React.useState<Date>(
    initialValues.start ?? now
  );
  const [end, setEnd] = React.useState<Date>(
    initialValues.end ?? min([addHours(now, 1), startOfTomorrow()])
  );

  const handleDateChange = (newDate: Date) => {
    const startOfDate = startOfDay(newDate);
    setDate(startOfDate);
    const newStart = setHours(setMinutes(newDate, getMinutes(start)), getHours(start));
    handleStartChange(newStart, startOfDate);
  }

  const handleStartChange = (newStart: Date, date: Date) => {
    const startTime = max([newStart, now, date]);
    const limitedStart = min([startTime, setHours(setMinutes(date, 45), 23)]);
    const changeInTime = differenceInMinutes(limitedStart, start);
    setStart(limitedStart);

    const shiftedEnd = min([addMinutes(end, changeInTime), addDays(date, 1)]);
    handleEndChange(shiftedEnd);
  }

  const handleEndChange = (newEnd: Date) => {
    if (newEnd.getHours() == 0 && newEnd.getMinutes() == 0) {
      setEnd(addDays(date, 1));
    } else {
      const adjustedEnd = new Date(start);
      adjustedEnd.setHours(newEnd.getHours(), newEnd.getMinutes());
      setEnd(adjustedEnd);
    }
  }

  const dateInputProps: InputProps = {
    type: "date",
    value: format(date, 'yyyy-MM-dd'),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
      handleDateChange(new Date(e.target.value));
    },
    slotProps: {
      input: {
        min: format(today, 'yyyy-MM-dd'),
        max: format(weekFromToday, 'yyyy-MM-dd'),
      }
    }
  }

  // Start must be greater than now, and start of day
  const shouldDisableStartTime = (time: Date) => {
    return isBefore(time, now) || isBefore(time, date);
  }

  const startTimePickerProps: JoyTimePickerProps = {
    value: start,
    onChange: (newStart: Date | null) => {
      if (newStart) handleStartChange(newStart, date);
    },
    shouldDisableTime: shouldDisableStartTime,
    minutesStep: 15,
  }

  // End time can always be midnight, but must be at least start + 15m
  const shouldDisableEndTime = (time: Date) => {
    if (time.getHours() == 0 && time.getMinutes() == 0) return false;

    const adjustedEnd = new Date(start);
    adjustedEnd.setHours(time.getHours(), time.getMinutes());
    return isBefore(adjustedEnd, addMinutes(start, 15));
  }

  const endTimePickerProps: JoyTimePickerProps = {
    value: end,
    onChange: (newEnd: Date | null) => {
      if (newEnd) handleEndChange(newEnd);
    },
    shouldDisableTime: shouldDisableEndTime,
    minutesStep: 15,
    referenceDate: date,
    showMidnightButton: true,
  }

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
  }
}
