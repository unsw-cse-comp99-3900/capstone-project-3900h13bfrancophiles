import * as React from 'react';
import Input, { InputProps } from '@mui/joy/Input';
import { unstable_useTimeField as useTimeField, UseTimeFieldProps } from '@mui/x-date-pickers/TimeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import { BaseSingleInputFieldProps, FieldSection, TimeValidationError, } from '@mui/x-date-pickers/models';
import { DesktopTimePicker, DesktopTimePickerProps, PickersActionBarProps } from '@mui/x-date-pickers';
import { AccessTime } from '@mui/icons-material';
import { Button, DialogActions } from '@mui/joy';
import { startOfDay } from 'date-fns';

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

export interface JoyTimePickerProps extends DesktopTimePickerProps<Date> {
  showMidnightButton?: boolean,
  size?: "sm" | "md" | "lg",
}

const JoyTimePicker = React.forwardRef(
  (props: JoyTimePickerProps, ref: React.Ref<HTMLDivElement>) => {
    const [isOpen, setOpen] = React.useState(false);

    const selectMidnight = () => props.onChange?.(
      startOfDay(props.referenceDate ?? new Date()),
      { validationError: null }
    );

    const renderActionBar = (actionBarProps: PickersActionBarProps) => {
      return props.showMidnightButton && (
        <DialogActions className={actionBarProps.className}>
          <Button
            variant="plain"
            sx={{ borderRadius: "0px 0px 4px 4px" }}
            onClick={selectMidnight}
          >
            Midnight
          </Button>
        </DialogActions>
      )
    }

    return (
      <DesktopTimePicker
        ref={ref}
        {...props}
        open={isOpen}
        onClose={() => setOpen(false)}
        disableOpenPicker
        closeOnSelect={false}
        thresholdToRenderTimeInASingleColumn={48}
        skipDisabled
        slots={{
          ...props.slots,
          field: JoyTimeField,
          actionBar: renderActionBar
        }}
        slotProps={{
          ...props.slotProps,
          field: {
            ...props.slotProps?.field,
            size: props.size ?? "md",
            onClick: () => setOpen(true),
            readOnly: true,
            endDecorator: <AccessTime fontSize="small"/>,
          } as any,
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
