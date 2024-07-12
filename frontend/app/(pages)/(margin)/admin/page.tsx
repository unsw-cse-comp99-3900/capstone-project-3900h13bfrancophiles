import PendingBookings from "@/components/PendingBookings";
import {Stack, Typography} from "@mui/joy";
import Box from "@mui/joy/Box";

export default function Admin() {
  return (
    <Stack mb={5} spacing={5}>
      <Box>
        <Typography level="h1">Admin Dashboard</Typography>
        <Typography level="h2">Booking Requests</Typography>
        <PendingBookings/>
      </Box>
    </Stack>
  )
}