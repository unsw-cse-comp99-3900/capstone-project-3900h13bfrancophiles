import { API_URL } from './constants';

type APIResponse = {
  status: number;
  json: any;
}

async function apiCall(
  route: string,
  method: string,
  body: object = {},
  token?: string
): Promise<APIResponse> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + route, options);
  return {
    status: res.status,
    json: await res.json()
  };
}

// Calls for each API route
function login(zid: any, zpass: any) {
  return apiCall("/auth/login", "POST", { zid, zpass });
}

function logout(token: string) {
  return apiCall("/auth/logout", "POST", {}, token);
}

export default {
  login,
  logout,
}