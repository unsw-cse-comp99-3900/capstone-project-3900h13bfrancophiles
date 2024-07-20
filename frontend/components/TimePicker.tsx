import * as React from 'react';
import { Experimental_CssVarsProvider as MaterialCssVarsProvider, } from '@mui/material/styles';
import { CssVarsProvider, THEME_ID } from '@mui/joy/styles';
import Input, { InputProps } from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { unstable_useTimeField as useTimeField, UseTimeFieldProps } from '@mui/x-date-pickers/TimeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import { BaseSingleInputFieldProps, FieldSection, TimeValidationError, } from '@mui/x-date-pickers/models';
import { theme as joyTheme } from '@/app/ThemeRegistry';
import { DesktopTimePicker, DesktopTimePickerProps } from '@mui/x-date-pickers';
import { AccessTime } from '@mui/icons-material';

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  enableAccessibleFieldDOMStructure?: boolean;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  formControlSx?: InputProps['sx'];
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const JoyField = React.forwardRef((
  props: JoyFieldProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,

    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    formControlSx,
    endDecorator,
    startDecorator,
    slotProps,
    inputRef,
    ...other
  } = props;

  console.log("DesktopTimePicker:", props.onBlur !== undefined)

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={[...(Array.isArray(formControlSx) ? formControlSx : [formControlSx])]}
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        ref={ref}
        disabled={disabled}
        startDecorator={
          <React.Fragment>
            {startAdornment}
            {startDecorator}
          </React.Fragment>
        }
        endDecorator={
          <React.Fragment>
            {endAdornment}
            {endDecorator}
          </React.Fragment>
        }
        slotProps={{
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
          input: { ...slotProps?.input, ref: inputRef },
        }}
        readOnly={true}
        {...other}
      />
    </FormControl>
  );
}) as JoyFieldComponent;

interface JoyTimeFieldProps
  extends UseTimeFieldProps<Date, false>,
    BaseSingleInputFieldProps<
      Date | null,
      Date,
      FieldSection,
      false,
      TimeValidationError
    > {
}

const JoyTimeField = React.forwardRef(
  (props: JoyTimeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...textFieldProps } = props;

    const fieldResponse = useTimeField<Date, false, typeof textFieldProps>({
      ...textFieldProps,
      enableAccessibleFieldDOMStructure: false,
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const processedFieldProps = useClearableField({
      ...fieldResponse,
      slots,
      slotProps,
    });

    return <JoyField ref={ref} {...processedFieldProps} />;
  },
);

export const JoyTimePicker = React.forwardRef(
  (props: DesktopTimePickerProps<Date>, ref: React.Ref<HTMLDivElement>) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <DesktopTimePicker
        ref={ref}
        {...props}
        open={isOpen}
        onClose={() => setOpen(false)}
        disableOpenPicker
        slots={{
          ...props.slots,
          field: JoyTimeField,
        }}
        slotProps={{
          ...props.slotProps,
          field: {
            ...props.slotProps?.field,
            formControlSx: { flexDirection: 'row' },
            size: "sm",
            onClick: () => setOpen(true),
            readOnly: true,
            endDecorator: <AccessTime fontSize="small"/>,
          } as any,
        }}
      />
    );
  },
);

export default function JoyV6Field(props: DesktopTimePickerProps<Date>) {
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <JoyTimePicker
            {...props}
            slotProps={{
              ...props.slotProps,
              field: { ...props.slotProps?.field, clearable: false },
            }}
            minutesStep={15}
            skipDisabled={true}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}


