import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

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
      starttime: "2024-08-03T14:00:00Z",
      endtime: "2024-08-03T15:00:00Z",
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

    const spaceInput = screen.getByLabelText("Space");
    expect(spaceInput).toBeInTheDocument();
    expect(spaceInput).toHaveDisplayValue("");

    const dateInput = screen.getByLabelText("Date");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveValue("2024-08-03");

    const startInput = screen.getByLabelText("Time");
    expect(startInput).toBeInTheDocument();
    expect(startInput).toHaveDisplayValue("12:00 PM");

    const endInput = screen.getByLabelText("End Time");
    expect(endInput).toBeInTheDocument();
    expect(endInput).toHaveDisplayValue("01:00 PM");

    const descInput = screen.getByLabelText("Description");
    expect(descInput).toBeInTheDocument();
    expect(descInput).toHaveDisplayValue("");

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
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();

    expect(screen.getByText("New Booking")).toBeInTheDocument();
    expect(screen.getByText("Old Booking")).toBeInTheDocument();
  });
});
