import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import useReportSpaces from "../hooks/useReportSpaces";
import useReportTypes from "../hooks/useReportTypes";
import ReportGenerationForm from "../components/ReportGenerationForm";
import userEvent from "@testing-library/user-event";
import mock = jest.mock;

const mockSpaces = [
  { text: "Room 1", value: "K-K17-111", type: "room", level: "K17 L1" },
  { text: "Desk 1", value: "K-K17-100-1", type: "desk", level: "K17 L1" },
  { text: "Desk 2", value: "K-K17-200-2", type: "desk", level: "K17 L2" },
  { text: "Room 2", value: "K-K17-222", type: "room", level: "K17 L2" },
];

jest.mock("@/hooks/useReportSpaces");
const mockedUseSpaces = jest.mocked(useReportSpaces);
mockedUseSpaces.mockReturnValue({
  spaces: mockSpaces,
  isLoading: false,
  error: undefined,
});

jest.mock("@/hooks/useReportTypes");
const mockedUseAvailabilities = jest.mocked(useReportTypes);
mockedUseAvailabilities.mockReturnValue({
  types: [
    {
      type: "booking",
      name: "Booking Information",
      formats: ["xlsx", "pdf"],
    },
    {
      type: "occupancy",
      name: "Occupancy Data",
      formats: ["csv", "png"],
    },
  ],
  isLoading: false,
  error: undefined,
});

const mockGenerateReport = jest.fn();
mock("@/api", () => ({
  generateReport: mockGenerateReport,
}));
mockGenerateReport.mockReturnValue({
  blob: jest.fn().mockResolvedValue(new Blob([""])),
  headers: {
    get: jest.fn().mockReturnValue('filename="filename";'),
  },
});

const mockTime = new Date("2024-08-03T12:00:00");

describe("ReportGenerationForm", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockTime);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders the default blank form", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    expect(screen.getByLabelText("Report Type")).toHaveTextContent("Booking Information");
    expect(screen.getByLabelText("Start Date")).toHaveValue("2024-07-27");
    expect(screen.getByLabelText("End Date")).toHaveValue("2024-08-03");
    expect(screen.getByLabelText("Spaces")).toHaveDisplayValue([""]);

    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
  });

  it("shows correct report types", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    await user.click(screen.getByLabelText("Report Type"));
    expect(screen.getByRole("option", { name: /Booking Information/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Occupancy Data/i })).toBeInTheDocument();
  });

  it("shows correct report formats", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    const formatSelect = screen.getByLabelText("Format");
    await user.click(formatSelect);
    expect(screen.getByRole("option", { name: /xlsx/i }));
    expect(screen.getByRole("option", { name: /pdf/i }));

    const reportTypeSelect = screen.getByLabelText("Report Type");
    await user.click(reportTypeSelect);
    await user.click(screen.getByRole("option", { name: /Occupancy Data/i }));

    await user.click(formatSelect);
    expect(screen.getByRole("option", { name: /csv/i }));
    expect(screen.getByRole("option", { name: /png/i }));
  });

  it("shows error when selecting no spaces", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    await user.click(screen.getByRole("button", { name: /download/i }));

    expect(mockGenerateReport).not.toHaveBeenCalled();
    expect(screen.getByText(/select at least one space/i)).toBeInTheDocument();
  });

  test("all desks button", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    await user.click(screen.getByLabelText("Spaces"));
    const allDesksSwitch = screen.getByLabelText("All Desks");

    // one room as a control
    await user.click(screen.getByRole("option", { name: "Room 1" }));
    expectSelectedSpaces(["Room 1"]);

    // select all
    await user.click(allDesksSwitch);
    expect(allDesksSwitch).toBeChecked();
    expectSelectedSpaces(["Room 1", "Desk 1", "Desk 2"]);

    // unselect all
    await user.click(allDesksSwitch);
    expect(allDesksSwitch).not.toBeChecked();
    expectSelectedSpaces(["Room 1"]);

    // select one, then rest
    await user.click(screen.getByRole("option", { name: "Desk 1" }));
    expectSelectedSpaces(["Room 1", "Desk 1"]);

    await user.click(allDesksSwitch);
    expect(allDesksSwitch).toBeChecked();
    expectSelectedSpaces(["Room 1", "Desk 1", "Desk 2"]);

    // unselect one
    await user.click(screen.getByRole("option", { name: "Desk 1" }));
    expect(allDesksSwitch).not.toBeChecked();
    expectSelectedSpaces(["Room 1", "Desk 2"]);
  });

  test("all rooms button", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReportGenerationForm />
      </LocalizationProvider>,
    );

    await user.click(screen.getByLabelText("Spaces"));
    const allRoomsSwitch = screen.getByLabelText("All Rooms");

    // one desk as a control
    await user.click(screen.getByRole("option", { name: "Desk 1" }));
    expectSelectedSpaces(["Desk 1"]);

    // select all
    await user.click(allRoomsSwitch);
    expect(allRoomsSwitch).toBeChecked();
    expectSelectedSpaces(["Desk 1", "Room 1", "Room 2"]);

    // unselect all
    await user.click(allRoomsSwitch);
    expect(allRoomsSwitch).not.toBeChecked();
    expectSelectedSpaces(["Desk 1"]);

    // select one, then rest
    await user.click(screen.getByRole("option", { name: "Room 1" }));
    expectSelectedSpaces(["Desk 1", "Room 1"]);

    await user.click(allRoomsSwitch);
    expect(allRoomsSwitch).toBeChecked();
    expectSelectedSpaces(["Desk 1", "Room 1", "Room 2"]);

    // unselect one
    await user.click(screen.getByRole("option", { name: "Room 1" }));
    expect(allRoomsSwitch).not.toBeChecked();
    expectSelectedSpaces(["Desk 1", "Room 2"]);
  });
});

const expectSelectedSpaces = (spaces: string[]) => {
  for (const { text } of mockSpaces) {
    expect(screen.getByRole("option", { name: text })).toHaveAttribute(
      "aria-selected",
      spaces.includes(text) ? "true" : "false",
    );
  }
};
