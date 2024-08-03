import { count, sql } from "drizzle-orm";
import { booking } from "../../drizzle/schema";
import PDFKit from "pdfkit";
import { ReportGenerator } from "./index";
import { db } from "../index";
import { createCanvas } from "canvas";
import Chart from "chart.js/auto";

const canvas = createCanvas(700, 350);
const ctx = canvas.getContext("2d");

type GraphData = { spaceId: string; data: { timeSlot: string; count: number }[] }[];

const timeSlot = sql<string>`to_char
(generate_series(
    ${booking.starttime} at time zone 'UTC' at time zone 'Australia/Sydney',
    ${booking.endtime} at time zone 'UTC' at time zone 'Australia/Sydney',
    interval '15 minutes'
    ), 'HH24:MI')`.as("time_slot");

/**
 * Generates a PDF report of occupancy based on booking data.
 *
 * @param {Date} startDate - The start date for the report.
 * @param {Date} endDate - The end date for the report.
 * @param {string[]} spaces - The list of space IDs to include in the report.
 * @returns {Promise<Buffer>} - A promise that resolves with the generated PDF as a buffer.
 */
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
  const maxBookingNum = Math.max(...res.map((row) => row.count));

  const bookingCounts: Record<string, Record<string, number>> = {};
  for (const row of res) {
    if (!(row.spaceId in bookingCounts)) {
      bookingCounts[row.spaceId] = {};
    }
    bookingCounts[row.spaceId][row.timeSlot] = row.count;
  }

  const graphData: GraphData = spaces.map((spaceId) => ({ spaceId, data: [] }));
  for (const { spaceId, data } of graphData) {
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

      data.push({ timeSlot, count });
    }
  }

  return buildPdfAsync(async (pdf) => {
    const imageWidth = 450;
    const imageHeight = 225;
    const { top: yMargin, left: xMargin } = pdf.page.margins;
    let y = yMargin;

    for (const { spaceId, data } of graphData) {
      if (y + imageHeight > pdf.page.height - yMargin) {
        pdf.addPage();
        y = yMargin;
      }

      const chart = new Chart(ctx as unknown as CanvasRenderingContext2D, {
        type: "line",
        data: {
          labels: data.map((point) => point.timeSlot),
          datasets: [
            {
              yAxisID: "yAxis",
              label: "Number of Bookings",
              data: data.map((point) => point.count),
              fill: true,
              pointStyle: false,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: `Booking Times for ${spaceId}`,
            },
          },
          scales: {
            yAxis: {
              max: maxBookingNum + 2,
            },
          },
        },
      });

      pdf.image(canvas.toBuffer(), xMargin, y, { width: imageWidth, height: imageHeight });
      chart.destroy();

      y += imageHeight + yMargin;
    }
  });
};

/**
 * Builds a PDF asynchronously using the provided builder function.
 *
 * @param {(pdf: PDFKit.PDFDocument) => Promise<void>} builder - The function to build the PDF content.
 * @returns {Promise<Buffer>} - A promise that resolves with the generated PDF as a buffer.
 */
async function buildPdfAsync(builder: (pdf: PDFKit.PDFDocument) => Promise<void>): Promise<Buffer> {
  const pdf = new PDFKit();

  const buffers: Uint8Array[] = [];
  pdf.on("data", buffers.push.bind(buffers));

  return new Promise((resolve, reject) => {
    pdf.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    builder(pdf)
      .then(() => pdf.end())
      .catch((error) => reject(error));
  });
}
