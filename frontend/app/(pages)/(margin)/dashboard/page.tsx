import PastBookings from "@/components/booking-table/PastBookings";
import { Box, Stack, Typography } from "@mui/joy";
import CurrentBookings from "@/components/CurrentBookings";
import UpcomingBookings from "@/components/booking-table/UpcomingBookings";

export default function Dashboard() {
  return (
    <Stack mb={5} spacing={5}>
      <Box>
        <Typography level="h1">My Dashboard</Typography>
        <CurrentBookings />
      </Box>
      <Box>
        <Typography level="h2">Upcoming Bookings</Typography>
        <UpcomingBookings />
      </Box>
      <Box>
        <Typography level="h2">Past Bookings</Typography>
        <PastBookings />
      </Box>
    </Stack>
  );
}
