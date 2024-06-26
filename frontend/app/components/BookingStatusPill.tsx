import { Chip } from "@mui/joy"

interface BookingStatusPillProps {
  status: string
}
export default function BookingStatusPill({status}: BookingStatusPillProps) {
  let color: "success" | "warning" | "danger" = "warning";
  if (status === "Accepted") {
    color = "success";
  } else if (status === "Declined") {
    color = "danger";
  }
  return (
    <Chip
      color={color}
      variant="soft"
    >
      {status}
    </Chip>
  )
}