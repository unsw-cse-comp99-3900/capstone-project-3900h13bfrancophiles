import { generateBookingSpreadsheet } from "./bookingGenerators";

export type ReportGenerator = (
  startDate: Date,
  endDate: Date,
  spaces: string[],
) => Promise<Buffer>;

type ReportType = {
  key: string;
  name: string;
  formats: {
    [extension: string]: ReportGenerator,
  }
}

export const REPORT_TYPES: Record<string, ReportType> = {
  booking: {
    key: "booking",
    name: "Booking Information",
    formats: {
      xlsx: generateBookingSpreadsheet,
    }
  },
  checkin: {
    key: "checkin",
    name: "Booking & Check-in Information",
    formats: {
      xlsx: generateBookingSpreadsheet,
    }
  }
};