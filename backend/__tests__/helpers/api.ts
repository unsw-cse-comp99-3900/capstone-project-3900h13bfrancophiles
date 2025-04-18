import { API_URL } from "./constants";

type APIResponse = {
  status: number;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  json: any;
};

async function apiCall(
  route: string,
  method: string,
  body?: object,
  token?: string,
): Promise<APIResponse> {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + route, options);
  if (res.headers.get("Content-Type")?.startsWith("application/json")) {
    return {
      status: res.status,
      json: await res.json(),
    };
  } else {
    return {
      status: res.status,
      json: `"${res.body}"`,
    };
  }
}

// Calls for each API route
function login(zid: string, zpass: string) {
  return apiCall("/auth/login", "POST", { zid, zpass });
}

function logout(token: string) {
  return apiCall("/auth/logout", "POST", {}, token);
}

function createBooking(
  token: string,
  spaceid: string,
  starttime: Date | string,
  endtime: Date | string,
  description: string,
) {
  return apiCall("/bookings/create", "POST", { spaceid, starttime, endtime, description }, token);
}

function editBooking(
  token: string,
  id: number,
  starttime: Date | string,
  endtime: Date | string,
  spaceid: string,
  description?: string,
) {
  return apiCall("/bookings/edit", "PUT", { id, starttime, endtime, spaceid, description }, token);
}

function deleteBooking(id: number, token: string) {
  return apiCall("/bookings/delete", "DELETE", { id }, token);
}

function currentBookings(token: string) {
  return apiCall("/bookings/current", "GET", undefined, token);
}

function upcomingBookings(token: string) {
  return apiCall("/bookings/upcoming", "GET", undefined, token);
}

function pastBookings(token: string, page: number, limit: number, type: string, sort: string) {
  return apiCall(
    `/bookings/past?page=${page}&limit=${limit}&type=${type}&sort=${sort}`,
    "GET",
    undefined,
    token,
  );
}

function pendingBookings(token: string, page: number, limit: number, sort: string) {
  return apiCall(
    `/admin/bookings/pending?page=${page}&limit=${limit}&sort=${sort}`,
    "GET",
    undefined,
    token,
  );
}

function status(token: string, start: Date, end: Date) {
  return apiCall(
    `/status?datetimeStart=${start.toISOString()}&datetimeEnd=${end.toISOString()}`,
    "GET",
    undefined,
    token,
  );
}

function spaceStatus(token: string, spaceid: string) {
  return apiCall(`/status?spaceid=${spaceid}`, "GET", undefined, token);
}

function approveBooking(token: string, id: number) {
  return apiCall("/admin/bookings/approve", "PUT", { id }, token);
}

function declineBooking(token: string, id: number) {
  return apiCall("/admin/bookings/decline", "PUT", { id }, token);
}

function checkinBooking(token: string, id: number) {
  return apiCall("/bookings/checkin", "POST", { id }, token);
}

function checkoutBooking(token: string, id: number) {
  return apiCall("/bookings/checkout", "POST", { id }, token);
}

function spaces(token: string) {
  return apiCall("/spaces", "GET", undefined, token);
}

function rooms(token: string) {
  return apiCall("/rooms", "GET", undefined, token);
}

function singleSpace(token: string, id: string) {
  return apiCall("/spaces/" + id, "GET", undefined, token);
}

function bookable(token: string, id: string) {
  return apiCall("/bookable/" + id, "GET", undefined, token);
}

function reportSpaces(token: string) {
  return apiCall("/admin/reports/spaces", "GET", undefined, token);
}

function userDetails(token: string, zid: number) {
  return apiCall(`/users/${zid}`, "GET", undefined, token);
}

function reportTypes(token: string) {
  return apiCall("/admin/reports/types", "GET", undefined, token);
}

function generateReport(
  token: string,
  type: string,
  format: string,
  spaces: string[],
  startDate: string | Date,
  endDate: string | Date,
) {
  return apiCall(
    "/admin/reports/generate",
    "POST",
    { type, format, spaces, startDate, endDate },
    token,
  );
}

export default {
  apiCall,
  login,
  logout,
  createBooking,
  editBooking,
  deleteBooking,
  currentBookings,
  upcomingBookings,
  pastBookings,
  pendingBookings,
  status,
  spaceStatus,
  approveBooking,
  declineBooking,
  checkinBooking,
  checkoutBooking,
  spaces,
  rooms,
  singleSpace,
  bookable,
  reportSpaces,
  userDetails,
  reportTypes,
  generateReport,
};
