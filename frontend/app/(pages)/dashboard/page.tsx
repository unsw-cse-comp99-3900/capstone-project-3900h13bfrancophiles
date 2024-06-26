import PastBookings from "@/app/components/PastBookings";
import {Box, Stack, Typography} from "@mui/joy";
import CurrentBookingCard from "@/app/components/CurrentBookingCard";
import UpcomingBookings from "@/app/components/UpcomingBookings";

export default function Dashboard() {
  return (
    <Stack mb={5} spacing={5}>
      <Box>
        <Typography level="h1">
          My Dashboard
        </Typography>
        <Typography level="h2" mb={2}>
          Current Booking
        </Typography>
        <Stack spacing={2}>
          {/*Change to map when there is data*/}
          <CurrentBookingCard room='K17 G02 - Consultation Room' time='7:30 PM'/>
          <CurrentBookingCard room='K17 G02 - Consultation Room' time='7:30 PM'/>
          <CurrentBookingCard room='K17 G02 - Consultation Room' time='7:30 PM'/>
        </Stack>
      </Box>
      <Box>
        <Typography level="h2">
          Upcoming Bookings
        </Typography>
        <UpcomingBookings/>
      </Box>
      <Box>
        <Typography level="h2">
          Past Bookings
        </Typography>
        <PastBookings/>
      </Box>
    </Stack>
  )
}