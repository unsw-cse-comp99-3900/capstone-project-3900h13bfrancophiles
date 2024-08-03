import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RoomCard from "../components/RoomCard";
import AvailabilitiesPage from "../components/availability/AvailabilitiesPage"
import { Room } from "../types";
import useSpaceStatus from "../hooks/useSpaceStatus";
import useRoomCanBook from "../hooks/useRoomCanBook";
import useAvailabilities from "../hooks/useAvailabilities";
import useSpace from "../hooks/useSpace"
import BookingModal from "../components/booking-modal/BookingModal"

jest.mock("@/hooks/useAvailabilities");
jest.mock("@/hooks/useSpaceStatus");
jest.mock("@/hooks/useRoomCanBook");
jest.mock("@/hooks/useSpace");
jest.mock("@/components/booking-modal/BookingModal", () => jest.fn(() => null))

const mockedUseSpaceStatus = useSpaceStatus as jest.MockedFunction<typeof useSpaceStatus>;
const mockedUseRoomCanBook = useRoomCanBook as jest.MockedFunction<typeof useRoomCanBook>;
const mockedUseAvailabilities = useAvailabilities as jest.MockedFunction<typeof useAvailabilities>;
const mockedUseSpace = useSpace as jest.MockedFunction<typeof useSpace>;

const mockRoom: Room = {
  id: "K-K17-B01",
  name: "K17 CSE Basement",
  type: "Seminar Room",
  roomnumber: "B01",
  capacity: 100,
};

const mockHandleBook = jest.fn();

describe("BookingDisabledTooltip", () => {
  it("disabled room card calendar button cannot be clicked", async () => {
    mockedUseSpaceStatus.mockReturnValue({
      statusResponse: { "K-K17-B01": { status: "Available" } },
      isLoading: false,
      error: null,
    });
    mockedUseRoomCanBook.mockReturnValue({ canBook: false, isLoading: false, error: null });

    render(
      <RoomCard
        room={mockRoom}
        handleBook={mockHandleBook}
        datetimeStart="2024-07-29T10:00"
        datetimeEnd="2024-07-29T11:00"
      />,
    );

    expect(screen.getByText("K17 CSE Basement")).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(
        await screen.findByText("You do not have permission to book this space")
    ).toBeInTheDocument();
  });

  it("disabled cal page book button cannot be clicked", async () => {
    mockedUseSpaceStatus.mockReturnValue({
      statusResponse: { "K-K17-B01": { status: "Available" } },
      isLoading: false,
      error: null,
    });
    mockedUseRoomCanBook.mockReturnValue({ canBook: false, isLoading: false, error: null });
    mockedUseAvailabilities.mockReturnValue({ bookings: [], isLoading: false, error: null, mutate: jest.fn() })
    mockedUseSpace.mockReturnValue({
      space: mockRoom,
      type: "room",
      isLoading: false,
      error: null
    })

    render(
      <AvailabilitiesPage
        spaceId="K-K17-B01"
        spaceType="room"
      />
    );
    expect(BookingModal).toHaveBeenCalled()
    expect(screen.getByText('Book Now')).toBeDisabled();
    fireEvent.mouseEnter(screen.getByText('Book Now'));
    expect(
        await screen.findByText("You do not have permission to book this space")
    ).toBeInTheDocument();
  });
});
