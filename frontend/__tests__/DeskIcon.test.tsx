import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DeskIcon from "../components/desks/DeskIcon";
import { Booking, Desk } from "../types";
import useSpace from "../hooks/useSpace";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

jest.mock("@/hooks/useSpace");

const mockedUseSpace = useSpace as jest.MockedFunction<typeof useSpace>;

const mockDesk: Desk = {
  id: "K-K17-201-1",
  name: "test desk",
  floor: "K17 L2",
};

const mockBooking: Booking = {
  id: 1,
  zid: 1234567,
  starttime: "2024-07-29T10:00",
  endtime: "2024-07-29T12:00",
  spaceid: "K-K17-201-1",
  currentstatus: "",
  description: "",
  checkintime: "",
  checkouttime: "",
};

const mockSetSelectedDesk = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      ...window.location,
      reload: jest.fn(),
    },
  });
});

describe("DeskIcon", () => {
  it("renders available desk with correct icon", () => {
    mockedUseSpace.mockReturnValue({
      space: mockDesk,
      type: "desk",
      isLoading: false,
      error: null,
    });

    render(
      <TransformWrapper>
        <TransformComponent>
          <DeskIcon
            id={"K-K17-201-1"}
            x={500}
            y={500}
            date={new Date()}
            start={new Date()}
            end={new Date()}
            status={{ status: "Available" }}
            selectedDesk={""}
            setSelectedDesk={mockSetSelectedDesk}
          />
        </TransformComponent>
      </TransformWrapper>,
    );

    const avatarElement = screen.getByRole("img");

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveAttribute("src", "DeskIcon1.svg");
  });

  it("renders unavailable desk with userAvatar", async () => {
    mockedUseSpace.mockReturnValue({
      space: mockDesk,
      type: "desk",
      isLoading: false,
      error: null,
    });

    render(
      <TransformWrapper>
        <TransformComponent>
          <DeskIcon
            id={"K-K17-201-1"}
            x={500}
            y={500}
            date={new Date()}
            start={new Date()}
            end={new Date()}
            status={{ status: "Unavailable", booking: mockBooking }}
            selectedDesk={""}
            setSelectedDesk={mockSetSelectedDesk}
          />
        </TransformComponent>
      </TransformWrapper>,
    );

    const avatarElement = screen.getByRole("img");

    await waitFor(() => {
      expect(avatarElement).toBeInTheDocument();
      expect(avatarElement).not.toHaveAttribute("src", "DeskIcon1.svg");
    });
  });

  it("renders selected deskicon with popup", () => {
    mockedUseSpace.mockReturnValue({
      space: mockDesk,
      type: "desk",
      isLoading: false,
      error: null,
    });

    render(
      <TransformWrapper>
        <TransformComponent>
          <DeskIcon
            id={"K-K17-201-1"}
            x={500}
            y={500}
            date={new Date()}
            start={new Date()}
            end={new Date()}
            status={{ status: "Available" }}
            selectedDesk={"K-K17-201-1"}
            setSelectedDesk={mockSetSelectedDesk}
          />
        </TransformComponent>
      </TransformWrapper>,
    );

    const popupElement = screen.getByText("test desk");
    expect(popupElement).toBeInTheDocument();
  });

  it("renders non-selected deskicon without popup", () => {
    mockedUseSpace.mockReturnValue({
      space: mockDesk,
      type: "desk",
      isLoading: false,
      error: null,
    });

    render(
      <TransformWrapper>
        <TransformComponent>
          <DeskIcon
            id={"K-K17-201-1"}
            x={500}
            y={500}
            date={new Date()}
            start={new Date()}
            end={new Date()}
            status={{ status: "Available" }}
            selectedDesk={"K-K17-201-2"}
            setSelectedDesk={mockSetSelectedDesk}
          />
        </TransformComponent>
      </TransformWrapper>,
    );

    const popupElement = screen.queryByText("test desk");
    expect(popupElement).toBeNull();
  });
});
