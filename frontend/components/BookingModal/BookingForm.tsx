import React from 'react';
import { SpaceOption } from '@/types';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import {
  addDays,
  addMinutes,
  addWeeks,
  differenceInMinutes,
  format,
  getHours,
  getMinutes,
  max,
  min,
  parse,
  roundToNearestMinutes,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';
import {
  Autocomplete,
  AutocompleteOption,
  Divider,
  ListItemContent,
  ListItemDecorator,
  Textarea,
  Typography
} from '@mui/joy';
import Button from '@mui/joy/Button';
import useSpaces from '@/hooks/useSpaces';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';

interface BookingFormProps {
  space: SpaceOption | null;
  setSpace: React.Dispatch<React.SetStateAction<SpaceOption | null>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  start: Date;
  setStart: React.Dispatch<React.SetStateAction<Date>>;
  end: Date;
  setEnd: React.Dispatch<React.SetStateAction<Date>>;
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  space, setSpace,
  date, setDate,
  start, setStart,
  end, setEnd,
  desc, setDesc,
  onSubmit
}) => {
  const now = roundToNearestMinutes(new Date(), { nearestTo: 15, roundingMethod: "ceil" });
  const today = startOfDay(now);
  const weekFromToday = addWeeks(today, 1);

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

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={1} width={250}>
        <FormControl>
          <FormLabel>Space</FormLabel>
          <SpaceInput space={space} setSpace={setSpace}/>
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            required
            value={format(date, 'yyyy-MM-dd')}
            onChange={(e) => {
              if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
              handleDateChange(new Date(e.target.value));
            }}
            slotProps={{
              input: {
                min: format(today, 'yyyy-MM-dd'),
                max: format(weekFromToday, 'yyyy-MM-dd'),
              }
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Time</FormLabel>
          <Input
            type="time"
            required
            value={start ? format(start, 'HH:mm') : '--:--'}
            onChange={(e) => {
              if (!e.target.value.match(/\d{2}:\d{2}/)) return;
              handleStartChange(parse(e.target.value, 'HH:mm', date), date);
            }}
            onBlur={() => handleStartChange(roundToInterval(start), date)}
            slotProps={{
              input: {
                min: format(now, 'HH:mm'),
                step: 15 * 60,
              }
            }}
          />
        </FormControl>
        <FormControl>
          <Divider sx={{ mb: 1 }}>to</Divider>
          <FormLabel sx={{ display: 'none' }}>End Time</FormLabel>
          <Input
            type="time"
            required
            value={end ? format(end, 'HH:mm') : '--:--'}
            onChange={(e) => {
              if (!e.target.value.match(/\d{2}:\d{2}/)) return;
              handleEndChange(parse(e.target.value, 'HH:mm', date), date, start);
            }}
            onBlur={() => handleEndChange(roundToInterval(end), date, start)}
            slotProps={{
              input: {
                min: (start && end && format(end, 'HH:mm') !== '00:00')
                  ? format(start, 'HH:mm')
                  : undefined,
                step: 15 * 60,
              }
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            minRows={3}
            maxRows={3}
            slotProps={{ textarea: { maxLength: 250 } }}
          />
        </FormControl>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}


interface SpaceInputProps {
  space: SpaceOption | null;
  setSpace: React.Dispatch<React.SetStateAction<SpaceOption | null>>;
}

function SpaceInput({ space, setSpace }: SpaceInputProps) {
  const { spaces: options } = useSpaces();

  return (
    <Autocomplete
      required
      value={space}
      onChange={(_, value) => setSpace(value)}
      options={options ?? []}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <AutocompleteOption {...props} key={option.id}>
          <SpaceAutocompleteOption option={option}/>
        </AutocompleteOption>
      )}
    />
  )
}

function SpaceAutocompleteOption({ option }: { option: SpaceOption }) {
  return <>
    <ListItemDecorator>
      {option.isRoom
        ? <MeetingRoomTwoToneIcon/>
        : <TableRestaurantTwoToneIcon/>
      }
    </ListItemDecorator>
    <ListItemContent sx={{ fontSize: 'sm' }}>
      {option.name}
      <Typography level="body-xs">
        {option.id}
      </Typography>
    </ListItemContent>
  </>;
}

function roundToInterval(date: Date): Date {
  return date && roundToNearestMinutes(date, { nearestTo: 15 })
}

export default BookingForm;
