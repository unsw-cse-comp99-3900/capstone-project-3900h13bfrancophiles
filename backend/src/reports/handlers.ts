import { TypedRequest, TypedResponse } from "../types";
import { REPORT_TYPES } from "./index";
import typia from "typia";
import { db } from "../index";
import { space } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

interface GenerateReportRequest {
  type: string;
  spaces: string[];
  format: string;
  startDate: string & typia.tags.Format<"date-time">;
  endDate: string & typia.tags.Format<"date-time">;
}

export async function generateReport(
  req: TypedRequest<GenerateReportRequest>,
  res: TypedResponse
) {
  if (!typia.is<GenerateReportRequest>(req.body)) {
    res.status(400).send("Invalid input");
    return;
  }

  if (!(req.body.type in REPORT_TYPES)) {
    res.status(404).send("No such report type");
    return;
  }
  const reportType = REPORT_TYPES[req.body.type];

  if (!(req.body.format in reportType.formats)) {
    res.status(400).send("Unsupported file format for this report type");
    return;
  }

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  endDate.setDate(endDate.getDate() + 1);

  const fileData = reportType.formats[req.body.format](
    startDate,
    endDate,
    await toSpaceIds(req.body.spaces),
  );

  res.attachment(`${reportType.name}.${req.body.format}`);
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  res.send(fileData);
}

// Convert a list of spaces to individual space IDs
// This is mostly to convert from desk room IDs to desks
async function toSpaceIds(spaces: string[]) {
  const res = await db
    .select({ id: space.id })
    .from(space)
    .where(sql`${space.id} ~* ^(${spaces.join("|")})`);

  return res.map(res => res.id);
}