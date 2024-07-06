import { Input, InputProps } from '@mui/joy';
import React from 'react';

type DebounceProps = {
  handleChange: (value: string) => void;
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
};

// From https://mui.com/joy-ui/react-input/#debounced-input
export default function DebounceInput(props: InputProps & DebounceProps) {
  const { handleChange, handleDebounce, debounceTimeout, ...rest } = props;

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <Input {...rest} onChange={onChange} />;
}