import { count, sql } from "drizzle-orm";
import { booking } from "../../drizzle/schema";
import PDFKit from "pdfkit";
import { ReportGenerator } from "./index";
import { db } from "../index";

const timeSlot = sql<string>`to_char(generate_series(
  ${booking.starttime} at time zone 'UTC' at time zone 'Australia/Sydney',
  ${booking.endtime} at time zone 'UTC' at time zone 'Australia/Sydney',
  interval '15 minutes'
), 'HH24:MI')`.as("time_slot");

/*
SELECT      spaceid,
            to_char(generate_series(
                starttime at time zone 'UTC' at time zone 'Australia/Sydney',
                endtime at time zone 'UTC' at time zone 'Australia/Sydney',
                interval '15 minutes'
            ), 'HH24:MI') AS time_slot,
            count(*)
FROM        booking
GROUP BY    spaceid, time_slot
ORDER BY    spaceid, time_slot;
 */

export const generateOccupancyPdf: ReportGenerator = async (startDate, endDate, spaces) => {
  const res = await db
    .select({
      spaceId: booking.spaceid,
      timeSlot: timeSlot,
      count: count()
    })
    .from(booking)
    .groupBy(booking.spaceid, timeSlot)
    .orderBy(booking.spaceid, timeSlot);

  const pdfData = await buildPdfAsync((pdf) => {
    pdf.text(JSON.stringify(res, null, 2));
  });

  return pdfData;
}


async function buildPdfAsync(builder: (pdf: PDFKit.PDFDocument) => void): Promise<Buffer> {
  const pdf = new PDFKit();

  const buffers: Uint8Array[] = [];
  pdf.on('data', buffers.push.bind(buffers));

  return new Promise((resolve, reject) => {
    pdf.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    try {
      builder(pdf);
      pdf.end();
    } catch (error) {
      reject(error);
    }
  });
}

