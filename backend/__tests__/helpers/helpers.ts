import { API_URL } from './constants';

type APIResponse = {
  status: number;
  json: any;
}

export async function apiCall(
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
