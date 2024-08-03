import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useSpaces from "../hooks/useSpaces";
import useUser from "../hooks/useUser";
import useAvailabilities from "../hooks/useAvailabilities";
import BookingModal from "../components/booking-modal/BookingModal";
import { BookingUser } from "../types";

const mockUser: BookingUser = {
  zid: 5555555,
  email: "z5555555@ad.unsw.edu.au",
  fullname: "Mock User",
  title: null,
  school: "CSE",
  faculty: "ENG",
  role: null,
  usergrp: "admin",
  image: null,
};

jest.mock("@/hooks/useSpaces");
const mockedUseSpaces = jest.mocked(useSpaces);
mockedUseSpaces.mockReturnValue({
  spaces: [
    { name: "Room 1", id: "K-K17-111", isRoom: true },
    { name: "Room 2", id: "K-K17-222", isRoom: true },
    { name: "Desk 1", id: "K-K17-333-3", isRoom: false },
    { name: "Desk 2", id: "K-K17-444-4", isRoom: false },
  ],
  isLoading: false,
  error: undefined,
});

jest.mock("@/hooks/useAvailabilities");
const mockedUseAvailabilities = jest.mocked(useAvailabilities);
mockedUseAvailabilities.mockReturnValue({
  bookings: [
    {
      id: 0,
      zid: mockUser.zid,
      starttime: "2024-08-05T14:00:00",
      endtime: "2024-08-05T15:00:00",
      spaceid: "K-K17-111",
      currentstatus: "confirmed",
      checkintime: null,
      checkouttime: null,
    },
  ],
  isLoading: false,
  error: undefined,
  mutate: jest.fn(),
});

jest.mock("@/hooks/useUser");
const mockedUseUser = jest.mocked(useUser);
mockedUseUser.mockReturnValue({
  user: mockUser,
  isLoading: false,
  error: undefined,
});

jest.mock("jose", () => ({
  decodeJwt: () => ({
    user: mockUser.zid,
    group: mockUser.usergrp,
  }),
}));

const mockTime = new Date("2024-08-03T12:00:00");

describe("BookingModal", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockTime);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders the default blank modal", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal open={true} onClose={jest.fn()} />
      </LocalizationProvider>,
    );

    expect(screen.getByText("Create a new booking")).toBeInTheDocument();

    expect(screen.getByLabelText("Space")).toHaveDisplayValue("");
    expect(screen.getByLabelText("Date")).toHaveValue("2024-08-03");
    expect(screen.getByLabelText("Time")).toHaveDisplayValue("12:00 PM");
    expect(screen.getByLabelText("End Time")).toHaveDisplayValue("01:00 PM");
    expect(screen.getByLabelText("Description")).toHaveDisplayValue("");

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("pre-fills with props", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal
          open={true}
          onClose={jest.fn()}
          space="K-K17-111"
          date={new Date("2024-08-05")}
          start={new Date("2024-08-05T16:00:00")}
          end={new Date("2024-08-05T18:00:00")}
          desc="fun times"
        />
      </LocalizationProvider>,
    );

    expect(screen.getByLabelText("Space")).toHaveDisplayValue("Room 1");
    expect(screen.getByLabelText("Date")).toHaveValue("2024-08-05");
    expect(screen.getByLabelText("Time")).toHaveDisplayValue("04:00 PM");
    expect(screen.getByLabelText("End Time")).toHaveDisplayValue("06:00 PM");
    expect(screen.getByLabelText("Description")).toHaveDisplayValue("fun times");

    expect(screen.getByText("New Booking")).toBeInTheDocument();
    expect(screen.getByText("Mock User")).toBeInTheDocument();
  });

  it("renders the edit booking modal", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal
          open={true}
          onClose={jest.fn()}
          space="K-K17-111"
          date={new Date("2024-08-05")}
          start={new Date("2024-08-05T14:00:00")}
          end={new Date("2024-08-05T15:00:00")}
          desc="fun times"
          editedBookingId={0}
        />
      </LocalizationProvider>,
    );

    expect(screen.getByText("Edit booking")).toBeInTheDocument();

    expect(screen.getByLabelText("Space")).toHaveDisplayValue("Room 1");
    expect(screen.getByLabelText("Date")).toHaveValue("2024-08-05");
    expect(screen.getByLabelText("Time")).toHaveDisplayValue("02:00 PM");
    expect(screen.getByLabelText("End Time")).toHaveDisplayValue("03:00 PM");
    expect(screen.getByLabelText("Description")).toHaveDisplayValue("fun times");
    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();

    expect(screen.getByText("New Booking")).toBeInTheDocument();
    expect(screen.getByText("Old Booking")).toBeInTheDocument();
    expect(screen.queryByText("Mock User")).not.toBeInTheDocument();
  });

  it("disables submission on overlap", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal
          open={true}
          onClose={jest.fn()}
          space="K-K17-111"
          date={new Date("2024-08-05")}
          start={new Date("2024-08-05T14:30:00")}
          end={new Date("2024-08-05T15:30:00")}
          desc="fun times"
        />
      </LocalizationProvider>,
    );

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    expect(screen.queryByText("Mock User")).toBeInTheDocument();
  });

  it("shows space options", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal open={true} onClose={jest.fn()} />
      </LocalizationProvider>,
    );

    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByText("Room 1")).toBeInTheDocument();
    expect(screen.getByText("Room 2")).toBeInTheDocument();
    expect(screen.getByText("Desk 1")).toBeInTheDocument();
    expect(screen.getByText("Desk 2")).toBeInTheDocument();

    await user.type(screen.getByRole("combobox", { name: "Space" }), "De");
    expect(screen.queryByText("Room 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Room 2")).not.toBeInTheDocument();
    expect(screen.getByText("Desk 1")).toBeInTheDocument();
    expect(screen.getByText("Desk 2")).toBeInTheDocument();
  });

  it("moves end time with start time", async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal open={true} onClose={jest.fn()} />
      </LocalizationProvider>,
    );

    const startInput = screen.getByLabelText("Time");
    const endInput = screen.getByLabelText("End Time");

    await user.click(startInput);
    await user.click(screen.getByRole("option", { name: /4 hours/i }));
    await user.click(screen.getByRole("option", { name: /15 minutes/i }));

    expect(startInput).toHaveDisplayValue("04:15 PM");
    expect(endInput).toHaveDisplayValue("05:15 PM");
  });

  it("hides invalid start and end times", async () => {
    jest.setSystemTime(new Date("2024-08-05T13:00:00"));

    const user = userEvent.setup({ delay: null });

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BookingModal open={true} onClose={jest.fn()} space="K-K17-111" />
      </LocalizationProvider>,
    );

    const startInput = screen.getByLabelText("Time");
    const endInput = screen.getByLabelText("End Time");

    await user.click(startInput);
    expect(screen.queryByRole("option", { name: /12 hours/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /^1 hour/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /^2 hours/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /3 hours/i })).toBeInTheDocument();

    await user.click(endInput);
    expect(screen.queryByRole("option", { name: /01:00 pm/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /01:15 pm/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /01:30 pm/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /01:45 pm/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /02:00 pm/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /02:15 pm/i })).not.toBeInTheDocument();

    jest.setSystemTime(mockTime);
  });
});
