import { TypedRequest, TypedResponse } from "../types";
import { REPORT_TYPES } from "./index";
import typia from "typia";
import { db } from "../index";
import { space } from "../../drizzle/schema";
import { inArray } from "drizzle-orm";

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
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  if (!(req.body.type in REPORT_TYPES)) {
    res.status(404).json({ error: "No such report type" });
    return;
  }
  const reportType = REPORT_TYPES[req.body.type];

  if (!(req.body.format in reportType.formats)) {
    res.status(400).json({ error: "Unsupported file format for this report type" });
    return;
  }

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  endDate.setDate(endDate.getDate() + 1);

  const fileData = await reportType.formats[req.body.format](
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
    .where(inArray(space.id, spaces));

  return res.map(res => res.id);
}

type ReportTypeReturn = {
  types: {
    type: string,
    name: string,
    formats: string[],
  }[],
}

export async function getReportTypes(
  req: TypedRequest,
  res: TypedResponse<ReportTypeReturn>,
) {
  const types = Object.values(REPORT_TYPES).map((reportType) => ({
    type: reportType.key,
    name: reportType.name,
    formats: Object.keys(reportType.formats),
  }));

  res.json({ types });
}
