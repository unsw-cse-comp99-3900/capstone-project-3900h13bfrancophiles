import PendingBookings from "@/components/PendingBookings";
import { Stack, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import { ReportGenerationForm } from "@/components/ReportGenerationForm";

export default function Admin() {
  return (
    <Stack mb={5} spacing={5}>
      <Box>
        <Typography level="h1">Admin Dashboard</Typography>
        <Typography level="h2" gutterBottom>Generate Report</Typography>
        <ReportGenerationForm />
        <Typography level="h2" mt={3}>Booking Requests</Typography>
        <PendingBookings />
      </Box>
    </Stack>
  );
}
