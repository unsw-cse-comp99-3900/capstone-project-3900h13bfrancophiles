import * as React from 'react';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import {
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input, { InputProps } from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import {
  unstable_useTimeField as useTimeField,
  UseTimeFieldProps
} from '@mui/x-date-pickers/TimeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import {
  BaseSingleInputFieldProps,
  TimeValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';
import { theme as joyTheme } from '@/app/ThemeRegistry';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';

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

const JoyField = React.forwardRef(
  (props: JoyFieldProps, ref: React.Ref<HTMLDivElement>) => {
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
          {...other}
        />
      </FormControl>
    );
  },
) as JoyFieldComponent;

interface JoyTimeFieldProps
  extends UseTimeFieldProps<Date, false>,
    BaseSingleInputFieldProps<
      Date | null,
      Date,
      FieldSection,
      false,
      TimeValidationError
    > {}

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
  (props: TimePickerProps<Date>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <TimePicker
        ref={ref}
        {...props}
        slots={{ ...props.slots, field: JoyTimeField }}
        slotProps={{
          ...props.slotProps,
          field: {
            ...props.slotProps?.field,
            formControlSx: {
              flexDirection: 'row',
            },
          } as any,
        }}
      />
    );
  },
);

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode({ mode }: { mode: 'light' | 'dark' }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function JoyV6Field() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <JoyTimePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
