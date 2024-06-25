import {Stack, Typography} from "@mui/joy";
import CurrentBookingCard from "@/app/components/CurrentBookingCard";

export default function Dashboard() {
  return (<Stack>
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
    </Stack>)
}