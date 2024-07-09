import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  differenceInMinutes,
  format,
  getHours,
  getMinutes,
  isEqual,
  max,
  min,
  parse,
  roundToNearestMinutes,
  setHours,
  setMinutes,
  startOfDay,
  startOfTomorrow
} from 'date-fns';
import React from 'react';
import { InputProps } from '@mui/joy/Input';

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
    initialValues.date ?? startOfDay(now)
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
    handleEndChange(addMinutes(end, changeInTime), date, limitedStart);
  }

  const handleEndChange = (newEnd: Date, date: Date, start: Date) => {
    const limitedEnd = min([newEnd, addDays(date, 1)]);
    const minEnd = addMinutes(start, 15);
    setEnd(max([minEnd, limitedEnd]));
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

  const startInputProps: InputProps = {
    type: "time",
    value: format(start, 'HH:mm'),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.match(/\d{2}:\d{2}/)) return;
      handleStartChange(parse(e.target.value, 'HH:mm', date), date);
    },
    onBlur: () => handleStartChange(roundToInterval(start), date),
    slotProps: {
      input: {
        min: isEqual(startOfDay(now), date) ? format(now, 'HH:mm') : '00:00',
        max: '23:45',
        step: 15 * 60,
      }
    }
  }

  const endInputProps: InputProps = {
    type: "time",
    value: format(end, 'HH:mm'),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.match(/\d{2}:\d{2}/)) return;
      handleEndChange(parse(e.target.value, 'HH:mm', date), date, start);
    },
    onBlur: () => handleEndChange(roundToInterval(end), date, start),
    slotProps: {
      input: {
        min: (format(end, 'HH:mm') !== '00:00')
          ? format(start, 'HH:mm')
          : undefined,
        step: 15 * 60,
      }
    }
  }

  return {
    date,
    start,
    end,
    handleDateChange,
    handleStartChange,
    handleEndChange,
    dateInputProps,
    startInputProps,
    endInputProps,
  }
}

function roundToInterval(date: Date): Date {
  return date && roundToNearestMinutes(date, { nearestTo: 15 })
}