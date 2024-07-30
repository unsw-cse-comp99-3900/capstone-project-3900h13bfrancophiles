import { BACKEND_URL } from "@/config";
import { deleteCookie, getCookie } from "cookies-next";
import { Booking } from "@/types";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

// Helpers

/**
 * Generic fetch function for backend that also rejects if backend returns error
 */
const apiCall = <T>(
  route: string,
  method: HTTPMethod,
  params: object,
  headers: object = {},
): Promise<T> => {
  // Initialise fetch options
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (method === "GET") {
    // If GET, params go in URL
    if (Object.keys(params).length !== 0) {
      route += "?" + new URLSearchParams(params as Record<string, string>);
    }
  } else {
    // Otherwise go in body
    options.body = JSON.stringify(params);
  }

  return new Promise((resolve, reject) => {
    fetch(BACKEND_URL + route, options)
      .then((response) => {
        if (response.status === 401) {
          // Remove token and force reload, so you're redirected to login page
          deleteCookie("token");
          window.location.reload();
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) throw new Error(json.error);
        resolve(json);
      })
      .catch((err) => reject(err));
  });
};

// apiCall but pass the token
const authApiCall = <T>(
  route: string,
  method: HTTPMethod,
  params: object,
  headers: object = {},
): Promise<T> => {
  const token = getCookie("token");
  return apiCall(route, method, params, {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
};

/**
 * For use with SWR - takes URL of a GET request
 */
export function swrFetcher<T>(url: string) {
  return authApiCall<T>(url, "GET", {});
}

// Routes - see Backend API for description
export const login = (zid: string, zpass: string): Promise<{ token: string }> => {
  return apiCall("/auth/login", "POST", { zid, zpass });
};

export const logout = (): Promise<object> => {
  return authApiCall("/auth/logout", "POST", {});
};

export const createBooking = (
  spaceid: string,
  starttime: string,
  endtime: string,
  description: string,
): Promise<{ booking: Booking }> => {
  return authApiCall("/bookings/create", "POST", { spaceid, starttime, endtime, description });
};

export const editBooking = (
  id: number,
  starttime: string,
  endtime: string,
  spaceid: string,
  description: string,
): Promise<{ booking: Booking }> => {
  return authApiCall("/bookings/edit", "PUT", { id, starttime, endtime, spaceid, description });
};

export const deleteBooking = (id: number): Promise<object> => {
  return authApiCall("/bookings/delete", "DELETE", { id });
};

export const checkIn = (id: number): Promise<object> => {
  return authApiCall("/bookings/checkin", "POST", { id });
};

export const checkOut = (id: number): Promise<object> => {
  return authApiCall("/bookings/checkout", "POST", { id });
};

export const approveBooking = (id: number): Promise<object> => {
  return authApiCall("/admin/bookings/approve", "PUT", { id });
};

export const declineBooking = (id: number): Promise<object> => {
  return authApiCall("/admin/bookings/decline", "PUT", { id });
};

// This one is special because it returns a file, not JSON
export const generateReport = async (
  type: string,
  format: string,
  startDate: Date,
  endDate: Date,
  spaces: string[]
) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify({ type, format, startDate, endDate, spaces }),
  };

  return fetch(BACKEND_URL + "/admin/reports/generate", options);
}
