"use client"

import React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import {
  Autocomplete,
  AutocompleteOption,
  Divider,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  Textarea,
  Typography
} from '@mui/joy';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import {
  addHours,
  addMinutes,
  addWeeks,
  format,
  max,
  min,
  parse,
  roundToNearestMinutes,
  startOfToday,
  startOfTomorrow,
} from 'date-fns';

type SpaceOption = { name: string; id: string; isRoom: boolean };
// TODO: Fetch data
const options: SpaceOption[] = [
  { name: 'Meeting Room 302', id: 'K-K17-302', isRoom: true },
  { name: 'Consultation Room G02', id: 'K-K17-G02', isRoom: true },
  { name: 'K17 501 Desk 15', id: 'K-K17-501-15', isRoom: false },
  { name: 'K17 301K Desk 50', id: 'K-K17-301K-50', isRoom: false },
];

export default function BookingModal() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [space, setSpace] = React.useState<SpaceOption | null>(null);

  const today = startOfToday();
  const weekFromToday = addWeeks(today, 1);
  const [date, setDate] = React.useState(today);

  const now = roundToInterval(new Date()) as Date;
  const [start, setStart] = React.useState<Date | undefined>(now);
  const [end, setEnd] = React.useState<Date | undefined>(min([addHours(now, 1), startOfTomorrow()]));

  console.log({ space, date, start, end });

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add/>}
        onClick={() => setOpen(true)}
      >
        Open Modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Create a new booking</DialogTitle>
          <Stack direction="row" justifyContent="space-between" spacing={6}>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <Stack spacing={1} width={250}>
                <FormControl>
                  <FormLabel>Space</FormLabel>
                  <Autocomplete
                    required
                    value={space}
                    onChange={(_, value) => setSpace(value)}
                    options={options}
                    getOptionLabel={(option) => option.name}
                    getOptionKey={(option) => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                      <AutocompleteOption {...props} key={option.id}>
                        <SpaceAutocompleteOption option={option}/>
                      </AutocompleteOption>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    required
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (!e.target.value.match(/\d{4}-\d{2}-\d{2}/)) return;
                      setDate(new Date(e.target.value));
                      setStart(undefined);
                      setEnd(undefined);
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
                      setEnd(undefined);
                      setStart(parse(e.target.value, 'HH:mm', date));
                    }}
                    onBlur={() => setStart(roundToInterval)}
                    slotProps={{
                      input: {
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
                      if (start) {
                        setEnd(max([addMinutes(start, 15), parse(e.target.value, 'HH:mm', date)]));
                      } else {
                        setEnd(parse(e.target.value, 'HH:mm', date));
                      }
                    }}
                    onBlur={() => setEnd(roundToInterval)}
                    slotProps={{
                      input: {
                        min: start && format(start, 'HH:mm'),
                        step: 15 * 60,
                      }
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea minRows={3} maxRows={3} slotProps={{ textarea: { maxLength: 250 } }}/>
                </FormControl>
                <Button type="submit">Submit</Button>
              </Stack>
            </form>
            <Stack direction="column" width={300} spacing={1}>
              <Typography level="body-md" textAlign="center" fontWeight={500}>
                {format(date, 'EEEE, MMMM d')}
              </Typography>
              <Sheet variant="outlined" sx={{ height: "100%", borderRadius: 10 }}></Sheet>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
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

function roundToInterval(date: Date | undefined): Date | undefined {
  return date && roundToNearestMinutes(date, { nearestTo: 15 })
}