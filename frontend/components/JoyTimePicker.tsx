// Most of this file is from the example MUI X Date Pickers + JoyUI integration:
// https://mui.com/x/react-date-pickers/custom-field/#usage-with-joy-ui
import * as React from "react";
import Input, { InputProps } from "@mui/joy/Input";
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldProps,
} from "@mui/x-date-pickers/TimeField";
import { useClearableField } from "@mui/x-date-pickers/hooks";
import {
  BaseSingleInputFieldProps,
  FieldSection,
  TimeValidationError,
} from "@mui/x-date-pickers/models";
import {
  DesktopTimePicker,
  DesktopTimePickerProps,
  PickersActionBarProps,
} from "@mui/x-date-pickers";
import { AccessTime } from "@mui/icons-material";
import { Button, DialogActions, ToggleButtonGroup } from "@mui/joy";
import { addMinutes, startOfDay } from "date-fns";

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  enableAccessibleFieldDOMStructure?: boolean;
  InputProps?: {
    ref?: React.Ref<HTMLDivElement>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  formControlSx?: InputProps["sx"];
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: unknown };

const JoyField = React.forwardRef(function JoyField(
  props: JoyFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enableAccessibleFieldDOMStructure,
    disabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    BaseSingleInputFieldProps<Date | null, Date, FieldSection, false, TimeValidationError> {}

const JoyTimeField = React.forwardRef(function JoyTimeField(
  props: JoyTimeFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
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
});

export interface JoyTimePickerProps extends DesktopTimePickerProps<Date> {
  showMidnightButton?: boolean;
  size?: "sm" | "md" | "lg";
}

const JoyTimePicker = React.forwardRef(function JoyTimePicker(
  props: JoyTimePickerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const [isOpen, setOpen] = React.useState(false);

  const handleToggleMidnight = () => {
    if (props.value?.getHours() === 0 && props.value?.getMinutes() === 0) {
      props.onChange?.(addMinutes(props.value, -15), { validationError: null });
    } else {
      props.onChange?.(startOfDay(props.referenceDate ?? new Date()), { validationError: null });
    }
  };

  const renderActionBar = (actionBarProps: PickersActionBarProps) => {
    return (
      props.showMidnightButton && (
        <DialogActions className={actionBarProps.className}>
          <ToggleButtonGroup
            variant="plain"
            color="primary"
            sx={{ borderRadius: "0px 0px 4px 4px", width: "100%" }}
            onClick={handleToggleMidnight}
            value={
              props.value?.getHours() === 0 && props.value?.getMinutes() === 0 ? ["midnight"] : []
            }
          >
            <Button value="midnight" fullWidth>
              Midnight
            </Button>
          </ToggleButtonGroup>
        </DialogActions>
      )
    );
  };

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
        actionBar: renderActionBar,
      }}
      slotProps={{
        ...props.slotProps,
        field: {
          ...props.slotProps?.field,
          size: props.size ?? "md",
          onClick: () => setOpen(true),
          readOnly: true,
          endDecorator: <AccessTime fontSize="small" />,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        digitalClockSectionItem: {
          sx: {
            borderRadius: 1,
          },
        },
      }}
    />
  );
});

export default JoyTimePicker;
