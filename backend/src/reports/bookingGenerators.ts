import { ReportGenerator } from "./index";
import { booking } from "../../drizzle/schema";
import { and, gte, inArray, lte } from "drizzle-orm";
import { db } from "../index";
import XLSX from "xlsx";

export const generateBookingSpreadsheet: ReportGenerator = async (startDate, endDate, spaces) => {
  const data = await db
    .select()
    .from(booking)
    .where(and(
      gte(booking.starttime, startDate.toISOString()),
      lte(booking.endtime, endDate.toISOString()),
      inArray(booking.spaceid, spaces),
    ));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
};