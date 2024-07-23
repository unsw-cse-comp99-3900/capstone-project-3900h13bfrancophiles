import { API_URL } from './constants';

type APIResponse = {
  status: number;
  json: any;
};

async function apiCall(route: string, method: string, body?: object, token?: string): Promise<APIResponse> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + route, options);
  return {
    status: res.status,
    json: await res.json(),
  };
}

// Calls for each API route
function login(zid: any, zpass: any) {
  return apiCall('/auth/login', 'POST', { zid, zpass });
}

function logout(token: string) {
  return apiCall('/auth/logout', 'POST', {}, token);
}

function createBooking(token: string, spaceid: any, starttime: any, endtime: any, description: any) {
  return apiCall('/bookings/create', 'POST', { spaceid, starttime, endtime, description }, token);
}

function deleteBooking(id: number, token: string) {
  return apiCall('/bookings/delete', 'DELETE', { id }, token);
}

function currentBookings(token: string) {
  return apiCall('/bookings/current', 'GET', undefined, token);
}

function upcomingBookings(token: string) {
  return apiCall('/bookings/upcoming', 'GET', undefined, token);
}

export default {
  login,
  logout,
  createBooking,
  deleteBooking,
  currentBookings,
  upcomingBookings,
};
