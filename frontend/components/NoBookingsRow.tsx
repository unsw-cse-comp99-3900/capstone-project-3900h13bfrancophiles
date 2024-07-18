import Typography from '@mui/joy/Typography';
import * as React from 'react';
import { CircularProgress, Stack } from '@mui/joy';

interface NoBookingsRowProps {
  bookingType: string;
  colSpan: number;
  isLoading?: boolean;
}

export function NoBookingsRow({ bookingType, colSpan, isLoading }: NoBookingsRowProps) {
  return <tr>
    <td colSpan={colSpan}>
      {
        isLoading
          ? <Stack width="100%" alignItems="center" p={0.5}>
            <CircularProgress />
          </Stack>
          : <Typography level="body-sm" textAlign='center'>
            No {bookingType} Bookings
          </Typography>
      }
    </td>
  </tr>
}