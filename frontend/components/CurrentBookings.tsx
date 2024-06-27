'use client'

import { Box, Button, Card, CardContent, Skeleton, Stack, Typography } from "@mui/joy";
import { Booking } from '@/types';
import useSpace from '@/hooks/useSpace';
import useCurrentBookings from '@/hooks/useCurrentBookings';

function CurrentBookings() {
  const { currentBookings } = useCurrentBookings();

  return currentBookings?.length && (
    <>
      <Typography level="h2" mb={2}>Current Booking{currentBookings.length > 1 && "s"}</Typography>
      <Stack spacing={2}>
        {currentBookings.map((booking) => (
          <CurrentBookingCard
            key={booking.id}
            booking={booking}
          />
        ))}
      </Stack>
    </>
  )
}

interface CurrentBookingCardProps {
  booking: Booking;
}

function CurrentBookingCard({
                              booking
                            }: CurrentBookingCardProps) {
  const { space, isLoading } = useSpace(booking.spaceid);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          px={2}
          py={1}
          width="100%"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
        >
          <Box>
            <Typography level="h3" sx={{ textWrap: "wrap" }}>
              <Skeleton loading={isLoading}>{space?.name}</Skeleton>
            </Typography>
            <Typography level="body-lg" pb={1} sx={{ textWrap: "wrap" }}>
              <Skeleton loading={isLoading}>
                Booked until {new Date(booking.endtime).toLocaleTimeString()}
              </Skeleton>
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 4 }}
            height={60}
            width={{ xs: "100%", lg: "50%" }}
            py="10px"
            justifyContent="flex-end"
          >
            <Button
              size="sm"
              color="success"
              sx={{ borderRadius: "20px", width: "100px" }}
            >
              Check in
            </Button>
            <Button
              size="sm"
              color="primary"
              sx={{ borderRadius: "20px", width: "150px" }}
            >
              Contact Support
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CurrentBookings;
