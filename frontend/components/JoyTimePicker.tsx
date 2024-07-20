import * as React from 'react';
import Input, { InputProps } from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { unstable_useTimeField as useTimeField, UseTimeFieldProps } from '@mui/x-date-pickers/TimeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import { BaseSingleInputFieldProps, FieldSection, TimeValidationError, } from '@mui/x-date-pickers/models';
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

const JoyTimePicker = React.forwardRef(
  (props: DesktopTimePickerProps<Date>, ref: React.Ref<HTMLDivElement>) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <DesktopTimePicker
        ref={ref}
        {...props}
        open={isOpen}
        onClose={() => setOpen(false)}
        disableOpenPicker
        closeOnSelect={false}
        minutesStep={15}
        skipDisabled
        slots={{
          ...props.slots,
          field: JoyTimeField,
        }}
        slotProps={{
          ...props.slotProps,
          field: {
            ...props.slotProps?.field,
            formControlSx: { flexDirection: 'column' },
            size: "sm",
            onClick: () => setOpen(true),
            readOnly: true,
            endDecorator: <AccessTime fontSize="small"/>,
          } as any,
          actionBar: {
            actions: [],
          },
          digitalClockSectionItem: {
            sx: {
              borderRadius: 1,
            }
          },
        }}
      />
    );
  },
);

export default JoyTimePicker;
