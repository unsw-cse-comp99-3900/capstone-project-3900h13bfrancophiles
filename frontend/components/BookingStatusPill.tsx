import { Chip } from "@mui/joy";

interface BookingStatusPillProps {
  status: string;
}
export default function BookingStatusPill({ status }: BookingStatusPillProps) {
  let color: "success" | "warning" | "danger" = "warning";
  let text: "Accepted" | "Declined" | "Pending" = "Pending";
  if (status === "confirmed") {
    color = "success";
    text = "Accepted";
  } else if (status === "declined") {
    color = "danger";
    text = "Declined"
  }
  return (
    <Chip color={color} variant="soft">
      {text}
    </Chip>
  );
}
