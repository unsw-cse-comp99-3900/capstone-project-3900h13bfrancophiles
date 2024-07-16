import { Chip } from "@mui/joy";

interface BookingStatusPillProps {
  status: string;
}
export default function BookingStatusPill({ status }: BookingStatusPillProps) {
  let color: "success" | "warning" | "danger" = "warning";
  let text: "Accepted" | "Declined" | "Pending" = "Pending";

  switch (status) {
    case "confirmed":
      color = "success";
      text = "Accepted";
      break;
    case "declined":
      color = "danger";
      text = "Declined";
      break;
  }

  return (
    <Chip color={color} variant="soft">
      {text}
    </Chip>
  );
}
