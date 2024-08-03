import * as React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeskInfoPopup from "../components/DeskInfoPopup";
import { Booking, UserData } from "../types";

jest.mock('@/components/BookingModal/BookingModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    open ? <div data-testid="booking-modal">Booking Modal</div> : null
  ),
}));

// mock toLocaleString for consistency of tests
let mockDate;
beforeAll(() => {
  mockDate = jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('12:00 AM');
});

afterAll(() => {
  mockDate.mockRestore();
});

describe('DeskInfoPopup', () => {
  const handleClose = jest.fn();
  const mockUser: UserData = {
    name: 'Umar',
    image: 'base64encodedimage',
  };
  const mockBooking: Booking = {
    id: 1,
    zid: 1234567,
    starttime: "2024-07-29T05:00",
    endtime: "2024-07-29T06:00",
    spaceid: "K-K17-201-1",
    currentstatus: "",
    description: "",
    checkintime: "",
    checkouttime: ""
  };

  test('renders DeskInfoPopup with booking information', () => {
    render(
      <DeskInfoPopup
        id="desk1"
        deskName="Test Desk"
        booking={mockBooking}
        user={mockUser}
        date={new Date()}
        start={new Date()}
        end={new Date()}
        handleClose={handleClose}
        reference={null}
      />
    );

    expect(screen.getByText('Test Desk')).toBeInTheDocument();
    expect(screen.getByText('Umar')).toBeInTheDocument();
    expect(screen.getByText('12:00 AM - 12:00 AM')).toBeInTheDocument();
    expect(screen.queryByText('Book for')).not.toBeInTheDocument();
  });

  test('renders DeskInfoPopup without booking information', async () => {
    render(
      <DeskInfoPopup
        id="desk1"
        deskName="Test Desk"
        booking={null}
        user={null}
        date={new Date('2024-08-03T00:00:00+10:00')}
        start={new Date('2024-08-03T11:30:00+10:00')}
        end={new Date('2024-08-03T12:30:00+10:00')}
        handleClose={handleClose}
        reference={null}
      />
    );
    expect(screen.getByText('Test Desk')).toBeInTheDocument();
    expect(screen.getByText("Book for 12:00 AM - 12:00 AM")).toBeInTheDocument();
    expect(screen.queryByText('Umar')).not.toBeInTheDocument();
  });

  test('calls handleClose on close button click', () => {
    render(
      <DeskInfoPopup
        id="desk1"
        deskName="Test Desk"
        booking={null}
        user={null}
        date={new Date()}
        start={new Date()}
        end={new Date()}
        handleClose={handleClose}
        reference={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  test('opens BookingModal on Book button click', () => {
    render(
      <DeskInfoPopup
        id="desk1"
        deskName="Test Desk"
        booking={null}
        user={null}
        date={new Date()}
        start={new Date()}
        end={new Date()}
        handleClose={handleClose}
        reference={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /book/i }));
    expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
  });

  test('View all availabilities link directs to correct URL', () => {
    render(
      <DeskInfoPopup
        id="desk1"
        deskName="Test Desk"
        booking={null}
        user={null}
        date={new Date()}
        start={new Date()}
        end={new Date()}
        handleClose={handleClose}
        reference={null}
      />
    );

    const link = screen.getByRole('link', { name: /view all availabilities/i });
    expect(link).toHaveAttribute('href', '/desks/desk1');
  });

});