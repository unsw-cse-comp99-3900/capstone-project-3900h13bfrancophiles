import { TypedRequest, TypedResponse } from "../types";
import * as fs from "fs";

interface GenerateReportRequest {
  spaces: string[];
}

export function generateReport(req: TypedRequest<GenerateReportRequest>, res: TypedResponse) {
  const data: Buffer = fs.readFileSync(".prettierrc");

  res.attachment("file.json");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  res.send(data);
}