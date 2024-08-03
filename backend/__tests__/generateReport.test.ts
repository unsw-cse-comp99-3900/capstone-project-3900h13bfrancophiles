import api from "./helpers/api";
import { ADMINS, BASE_TIME, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/admin/reports/spaces", () => {
  test("Success - all report types", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;
    await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(45), "");

    res = await api.reportSpaces(token);
    expect(res.status).toStrictEqual(200);
    const allSpaces = res.json.spaces.map((space: { value: string }) => space.value);

    res = await api.reportTypes(token);
    expect(res.status).toStrictEqual(200);
    const reportTypes = res.json.types;

    for (const reportType of reportTypes) {
      for (const reportFormat of reportType.formats) {
        res = await api.generateReport(
          token,
          reportType.type,
          reportFormat,
          allSpaces,
          minutesFromBase(-30 * 24 * 60),
          BASE_TIME,
        );
        expect(res.status).toStrictEqual(200);
      }
    }
  });

  test("Failure - invalid report type", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.generateReport(
      token,
      "DEFINITELY NOT A VALID TYPE",
      "xlsx",
      [],
      minutesFromBase(-30 * 24 * 60),
      BASE_TIME,
    );
    expect(res.status).toStrictEqual(404);
  });

  test("Failure - invalid report format", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.generateReport(
      token,
      "booking",
      "DEFINITELY NOT A VALID FORMAT",
      [],
      minutesFromBase(-30 * 24 * 60),
      BASE_TIME,
    );
    expect(res.status).toStrictEqual(400);
  });
});
