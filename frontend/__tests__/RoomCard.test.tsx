import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
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
    mockedUseSpaceStatus.mockReturnValue({
      statusResponse: { "K-K17-B01": { status: "Available" } },
      isLoading: false,
      error: null,
    });
    mockedUseRoomCanBook.mockReturnValue({ canBook: true, isLoading: false, error: null });

    render(
      <RoomCard
        room={mockRoom}
        handleBook={mockHandleBook}
        datetimeStart="2024-07-29T10:00"
        datetimeEnd="2024-07-29T11:00"
      />,
    );

    expect(screen.getByText("K17 CSE Basement")).toBeInTheDocument();
    expect(screen.getByText("Seminar Room")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("does not allow you to book room and displays tooltip when room cannot be booked", async () => {
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
    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(
      await screen.findByText("You do not have permission to book this space"),
    ).toBeInTheDocument();
  });
});
