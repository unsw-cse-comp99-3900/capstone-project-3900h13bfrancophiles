import { BACKEND_URL } from '@/config';
import { deleteCookie, getCookie } from 'cookies-next';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Helpers

/**
 * Generic fetch function for backend that also rejects if backend returns error
 */
const apiCall = <T>(
  route: string,
  method: HTTPMethod,
  params: object,
  headers: object = {}
): Promise<T> => {
  // Initialise fetch options
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
  };

  if (method === 'GET') {
    // If GET, params go in URL
    route += '?' + new URLSearchParams(params as Record<string, string>);
  } else {
    // Otherwise go in body
    options.body = JSON.stringify(params);
  }

  return new Promise((resolve, reject) => {
    fetch(BACKEND_URL + route, options)
      .then(response => {
        if (response.status === 401) {
          deleteCookie("token");
          throw new Error("Unauthenticated");
        }
        return response.json();
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        resolve(json);
      })
      .catch(err => reject(err));
  });
}

// apiCall but pass the token
const authApiCall = <T>(
  route: string,
  method: HTTPMethod,
  params: object,
  headers: object = {}
): Promise<T> => {
  const token = getCookie("token");
  return apiCall(
    route,
    method,
    params,
    {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
}

// Routes - see Backend API for description
export const login = (
  zid: string,
  zpass: string
): Promise<{ token: string }> => {
  return apiCall('/auth/login', 'POST', { zid, zpass });
}

export const logout = (): Promise<{}> => {
  return authApiCall('/auth/logout', 'POST', {});
}
