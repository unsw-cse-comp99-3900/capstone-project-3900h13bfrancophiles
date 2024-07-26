
type ReportGenerator = (
  startDate: Date,
  endDate: Date,
  spaces: string[],
) => Buffer;

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

    }
  },
  checkin: {
    key: "checkin",
    name: "Booking & Check-in Information",
    formats: {

    }
  }
};