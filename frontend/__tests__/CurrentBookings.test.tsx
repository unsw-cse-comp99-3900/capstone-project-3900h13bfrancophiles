import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import useSpace from "../hooks/useSpace";
import useCurrentBookings from "../hooks/useCurrentBookings";
import { Room, Booking } from "../types";
import CurrentBookings from "../components/CurrentBookings"
jest.mock("@/hooks/useSpace");
jest.mock("@/hooks/useCurrentBookings");

const mockedUseSpace = useSpace as jest.MockedFunction<typeof useSpace>;
const mockedUseCurrentBookings = useCurrentBookings as jest.MockedFunction<typeof useCurrentBookings>;

const mockRoom: Room = {
  id: "K-K17-B01",
  name: "K17 CSE Basement",
  type: "Seminar Room",
  roomnumber: "B01",
  capacity: 100,
};

const mockConfirmedBooking: Booking = {
  id: 1,
  zid: 1234567,
  starttime: new Date().toISOString(),
  endtime: new Date().toISOString(),
  spaceid: "K-K17-B01",
  currentstatus: "confirmed",
  description: "desc",
  checkintime: null,
  checkouttime: null,
}

const mockCheckedInBooking: Booking = {
  id: 1,
  zid: 1234567,
  starttime: new Date().toISOString(),
  endtime: new Date().toISOString(),
  spaceid: "K-K17-B01",
  currentstatus: "checkedin",
  description: "desc",
  checkintime: null,
  checkouttime: null,
}

const mockHandleBook = jest.fn();

describe("CurrentBookings", () => {
  it("has a check in button when booking is confirmed", () => {

    mockedUseCurrentBookings.mockReturnValue({
      currentBookings: [mockConfirmedBooking],
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    mockedUseSpace.mockReturnValue({
      space: mockRoom,
      type: "room",
      isLoading: false,
      error: null,
    });

    render(
      <CurrentBookings/>
    );
    expect(screen.getByText("Check In")).toBeInTheDocument();
    expect(screen.queryAllByText("Check Out")).toHaveLength(0);
  });

  it("has a check out button when booking is checkedin", () => {
    mockedUseCurrentBookings.mockReturnValue({
      currentBookings: [mockCheckedInBooking],
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    mockedUseSpace.mockReturnValue({
      space: mockRoom,
      type: "room",
      isLoading: false,
      error: null,
    });

    render(
      <CurrentBookings/>
    );
    expect(screen.getByText("Check Out")).toBeInTheDocument();
    expect(screen.queryAllByText("Check In")).toHaveLength(0)
  });

  it("does not exist when there are no current bookings", () => {
    mockedUseCurrentBookings.mockReturnValue({
      currentBookings: [],
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    mockedUseSpace.mockReturnValue({
      space: mockRoom,
      type: "room",
      isLoading: false,
      error: null,
    });

    render(
      <CurrentBookings/>
    );
    expect(screen.queryAllByText("Check Out")).toHaveLength(0)
    expect(screen.queryAllByText("Check In")).toHaveLength(0)
    expect(screen.queryAllByText("Booking")).toHaveLength(0)
  });
});
