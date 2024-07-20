import React from 'react';
import { SpaceOption } from '@/types';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input, { InputProps } from '@mui/joy/Input';
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
import JoyTimePicker, { JoyTimePickerProps } from '@/components/JoyTimePicker';

interface BookingFormProps {
  space: SpaceOption | null;
  setSpace: React.Dispatch<React.SetStateAction<SpaceOption | null>>;
  dateInputProps: InputProps,
  startTimePickerProps: JoyTimePickerProps,
  endTimePickerProps: JoyTimePickerProps,
  desc: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: React.FormEventHandler;
}

const BookingForm: React.FC<BookingFormProps> = ({
  space, setSpace,
  dateInputProps,
  startTimePickerProps,
  endTimePickerProps,
  desc, setDesc,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={1} width={250}>
        <FormControl>
          <FormLabel>Space</FormLabel>
          <SpaceInput space={space} setSpace={setSpace}/>
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input required {...dateInputProps} />
        </FormControl>
        <FormControl>
          <FormLabel>Time</FormLabel>
          <JoyTimePicker sx={{ pl: 0.5 }} {...startTimePickerProps} />
        </FormControl>
        <FormControl>
          <Divider sx={{ mb: 1 }}>to</Divider>
          <FormLabel sx={{ display: 'none' }}>End Time</FormLabel>
          <JoyTimePicker sx={{ pl: 0.5 }} {...endTimePickerProps} />
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

export default BookingForm;
