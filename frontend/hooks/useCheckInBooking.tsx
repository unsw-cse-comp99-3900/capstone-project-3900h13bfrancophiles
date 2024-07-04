async function checkInBooking(id: number) {
  const response = await fetch(`/bookings/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check in booking');
  }

  return response.json();
}

/**
 * Hook to fetch current bookings
 */
export default function useCheckInBooking() {
  const checkIn = async (id: number) => {
    return await checkInBooking(id);
  };

  return { checkIn };
}
