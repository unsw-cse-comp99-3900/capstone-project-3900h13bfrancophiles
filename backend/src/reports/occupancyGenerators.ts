import { count, sql } from "drizzle-orm";
import { booking } from "../../drizzle/schema";
import PDFKit from "pdfkit";
import { ReportGenerator } from "./index";
import { db } from "../index";

const timeSlot = sql<string>`to_char
(generate_series(
    ${booking.starttime} at time zone 'UTC' at time zone 'Australia/Sydney',
    ${booking.endtime} at time zone 'UTC' at time zone 'Australia/Sydney',
    interval '15 minutes'
    ), 'HH24:MI')`.as("time_slot");

type GraphData = { [spaceId: string]: { timeSlot: string; count: number }[] };

export const generateOccupancyPdf: ReportGenerator = async (startDate, endDate, spaces) => {
  const res = await db
    .select({
      spaceId: booking.spaceid,
      timeSlot: timeSlot,
      count: count(),
    })
    .from(booking)
    .groupBy(booking.spaceid, timeSlot)
    .orderBy(booking.spaceid, timeSlot);

  const bookingCounts: Record<string, Record<string, number>> = {};
  for (const row of res) {
    if (!(row.spaceId in bookingCounts)) {
      bookingCounts[row.spaceId] = {};
    }
    bookingCounts[row.spaceId][row.timeSlot] = row.count;
  }

  const graphData: GraphData = Object.fromEntries(spaces.map((space) => [space, []]));
  for (const spaceId in graphData) {
    for (let i = 0; i < 96; i++) {
      const hour = Math.floor(i / 4)
        .toString()
        .padStart(2, "0");
      const minute = ((i % 4) * 15).toString().padStart(2, "0");
      const timeSlot = `${hour}:${minute}`;

      let count = 0;
      for (const returnedSpaceId in bookingCounts) {
        if (returnedSpaceId.startsWith(spaceId)) {
          count += bookingCounts[returnedSpaceId][timeSlot] ?? 0;
        }
      }
      graphData[spaceId].push({ timeSlot, count });
    }
  }

  const pdfData = await buildPdfAsync((pdf) => {
    pdf.text(JSON.stringify(graphData, null, 2));
  });

  return pdfData;
};

async function buildPdfAsync(builder: (pdf: PDFKit.PDFDocument) => void): Promise<Buffer> {
  const pdf = new PDFKit();

  const buffers: Uint8Array[] = [];
  pdf.on("data", buffers.push.bind(buffers));

  return new Promise((resolve, reject) => {
    pdf.on("end", () => {
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
