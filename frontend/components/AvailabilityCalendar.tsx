import { Booking } from "@/types";

interface AvailabilityCalendarProps {
  bookings: Booking[];
}

export default function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {
  console.log(bookings)
  return (
    <>
      calendar
    </>
  );
}
