import * as React from "react";
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import RoomCard from "../components/RoomCard";
import { Room } from "../types";
import useSpaceStatus from "../hooks/useSpaceStatus";
import useRoomCanBook from "../hooks/useRoomCanBook";
jest.mock("@/hooks/useSpaceStatus");
jest.mock("@/hooks/useRoomCanBook");

const mockedUseSpaceStatus = useSpaceStatus as jest.MockedFunction<typeof useSpaceStatus>;
const mockedUseRoomCanBook = useRoomCanBook as jest.MockedFunction<typeof useRoomCanBook>;

const mockRoom: Room = {
  id: "K-K17-B01",
  name: "K17 CSE Basement",
  type: "Seminar Room",
  roomnumber: "B01",
  capacity: 100,
};

const mockHandleBook = jest.fn();

describe("RoomCard", () => {
  it("renders RoomCard component with correct details", () => {
    mockedUseSpaceStatus.mockReturnValue({ statusResponse: { "K-K17-B01": { status: "Available" } }, isLoading: false, error: null });
    mockedUseRoomCanBook.mockReturnValue({ canBook: true, isLoading: false, error: null });

    render(
      <RoomCard
        room={mockRoom}
        handleBook={mockHandleBook}
        datetimeStart="2024-07-29T10:00:00Z"
        datetimeEnd="2024-07-29T11:00:00Z"
      />
    );

    expect(screen.getByText("K17 CSE Basement")).toBeInTheDocument();
    expect(screen.getByText("Seminar Room")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });
});
