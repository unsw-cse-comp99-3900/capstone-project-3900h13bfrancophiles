import { TypedRequest, TypedResponse } from "../types";
import { REPORT_TYPES } from "./index";
import typia from "typia";
import { db } from "../index";
import { hotdesk, room, space } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

interface GenerateReportRequest {
  type: string;
  spaces: string[];
  format: string;
  startDate: string & typia.tags.Format<"date-time">;
  endDate: string & typia.tags.Format<"date-time">;
}

export async function generateReport(req: TypedRequest<GenerateReportRequest>, res: TypedResponse) {
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
    .where(sql`${space.id} ~* ${sql.raw("'^(" + spaces.join("|") + ")'")}`);

  return res.map((res) => res.id);
}

type ReportTypeReturn = {
  types: {
    type: string;
    name: string;
    formats: string[];
  }[];
};

export async function getReportTypes(req: TypedRequest, res: TypedResponse<ReportTypeReturn>) {
  const types = Object.values(REPORT_TYPES).map((reportType) => ({
    type: reportType.key,
    name: reportType.name,
    formats: Object.keys(reportType.formats),
  }));

  res.json({ types });
}

interface ReportSpace {
  text: string;
  value: string;
  type: "room" | "desk";
  level: string;
}

export async function getReportSpaces(
  req: TypedRequest,
  res: TypedResponse<{ spaces: ReportSpace[] }>,
) {
  const spaces: ReportSpace[] = [];

  const roomData = await db
    .select({ id: space.id, name: space.name })
    .from(room)
    .innerJoin(space, eq(room.id, space.id));

  for (const room of roomData) {
    const level = getLevel(room.id);
    if (!level) continue;
    spaces.push({
      text: room.name,
      value: room.id,
      type: "room",
      level,
    });
  }

  const deskData = await db
    .select({ id: space.id, name: space.name })
    .from(hotdesk)
    .innerJoin(space, eq(hotdesk.id, space.id));

  for (const desk of deskData) {
    const level = getLevel(desk.id);
    if (!level) continue;
    const [campus, bldg, roomNum] = desk.id.split("-");

    const roomId = `${campus}-${bldg}-${roomNum}`;
    if (spaces.find((space) => space.value === roomId)) continue;

    spaces.push({
      text: `${bldg} Room ${roomNum} Desks`,
      value: roomId,
      type: "desk",
      level,
    });
  }

  spaces.sort(compareSpace);
  res.json({ spaces });
}

function getLevel(spaceId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_campus, bldg, roomNum] = spaceId.split("-");
  const numMatch = roomNum.match(/^\d/);
  if (numMatch) {
    return bldg + " L" + numMatch[0];
  }

  const alphaMatch = roomNum.match(/^[A-Z]+/);
  if (alphaMatch) {
    return bldg + " " + alphaMatch[0];
  }

  console.warn(`Warning: could not determine level of ${spaceId}`);
  return null;
}

function compareSpace(a: ReportSpace, b: ReportSpace): number {
  let cmp = a.level.localeCompare(b.level);
  if (cmp) return cmp;

  cmp = b.type.localeCompare(a.type);
  if (cmp) return cmp;

  return a.text.localeCompare(b.text);
}
