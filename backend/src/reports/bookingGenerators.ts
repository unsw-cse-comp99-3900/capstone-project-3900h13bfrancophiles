import { ReportGenerator } from "./index";
import { booking, person, space } from "../../drizzle/schema";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../index";
import XLSX from "xlsx";
import { formatBookingDates } from "../utils";

export const generateBookingSpreadsheet: ReportGenerator = async (startDate, endDate, spaces) => {
  const rows = await db
    .select()
    .from(booking)
    .innerJoin(person, eq(booking.zid, person.zid))
    .innerJoin(space, eq(booking.spaceid, space.id))
    .where(and(
      gte(booking.starttime, startDate.toISOString()),
      lte(booking.endtime, endDate.toISOString()),
      inArray(booking.spaceid, spaces),
    ))
    .orderBy(desc(booking.endtime));

  let cleanRows: Record<string, string>[] = rows
    .map((row) => {
      row.booking = formatBookingDates(row.booking);
      return row;
    })
    .map(({ booking, person, space }) => ({
      "Ref. No.": booking.id.toString(),
      "Space": space.name,
      "Date": new Date(booking.starttime).toLocaleDateString(),
      "Start Time": new Date(booking.starttime).toLocaleTimeString(),
      "End Time": new Date(booking.endtime).toLocaleTimeString(),
      "User zID": "z" + person.zid,
      "User Name": person.title + " " + person.fullname,
      "User Role": person.role ?? "N/A",
      "User Affiliation": person.school + "/" + person.faculty,
    }));

  const worksheet = XLSX.utils.json_to_sheet(cleanRows);

  // Set column widths
  if (cleanRows.length) {
    worksheet["!cols"] = Object.keys(cleanRows[0]).map((key) => ({
      wch: Math.max(key.length, ...cleanRows.map((row) => row[key].length)) + 1
    }));
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
    compression: true,
  });
};